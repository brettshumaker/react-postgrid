class PostCategorySelect extends React.Component {
	constructor( props ) {
		super(props);
	}
	
	onChange(e) {
		
		var selectedOption = [];
		
		jQuery.each( this.props.categories, function(){
			if ( this.id == e.target.value )
				selectedOption = this;
		});
		
		this.props.onCategorySelect(e.target.value, selectedOption);
		
	}

	render() {
		
		return (
			<div className="post-category-select">
				<label htmlFor="post-category">Choose a category</label>
				<select value={this.props.value} onChange={this.onChange.bind(this)} className="form-control">
					<option value="-1"> - Choose A Category - </option>
					<option value="0">Show All Posts</option>
					{this.props.categories.map(option => {
						return <option value={option.id} key={option.id} >{option.name} ({option.slug})</option>
					})}
				</select>
			</div>
		);
	}
}

class PostsGrid extends React.Component {
	
	constructor( props ) {
		super( props );
	}
	
	render() {
		
		if ( this.props.posts.length > 0 ) {
			var imgSize = this.props.imgSize;
			var postGridItems = this.props.posts.map(function(item){
				
				var img = {
					source_url: '//picsum.photos/300/150',
					width: 300,
					height: 150,
				};
				
				if ( typeof item._embedded['wp:featuredmedia'] !== "undefined" )
					var img = item._embedded['wp:featuredmedia'][0].media_details.sizes[imgSize];
					
				return <li className={'column post-id-' + item.id} key={item.id}><a href={item.link} title={item.title.rendered}><img src={img.source_url} width={img.width} height={img.height} data-pin-nopin="true" /><h3 className="post-title">{item.title.rendered}</h3></a></li>

			});
			
			return (
				<ul className="posts-grid">
					{postGridItems}
				</ul>
			);
		} else if ( '-1' == this.props.selectedCatID ) {
			return ( <div>{"Please choose a category above."}</div> );
		} else {
			return ( <div>{"No posts found for that category."}</div> );
		}
		
	}
	
}

class PostsGridPagination extends React.Component {
	
	constructor( props ) {
		super(props);
	}
	
	changePage(page, e, disabled = '') {
		
		e.preventDefault();
		
		// Don't do anything if the button is disabled
		// There's probably a better way to keep this function from even firing if the nav item is disabled, but it's late.
		if ( 'disabled' !== disabled )
			this.props.onPageNavigation(page);
		
	}
	
	getPagerData() {
		
		var pages = [];
		var startPage, endPage;
		var currentPage = this.props.currentPage;
		var totalPages = this.props.totalPages;
		
		if ( totalPages < 10 ) {
			// less than 10 pages, show all
			startPage = 1;
			endPage = totalPages;
		} else {
			// more than 10 pages, calculate start and end pages
			if ( currentPage <= 6 ) {
				startPage = 1;
				endPage = 10;
			} else if ( currentPage + 4 >= totalPages ) {
				startPage = totalPages - 9;
				endPage = totalPages;
			} else {
				startPage = currentPage - 5;
				endPage = currentPage + 4;
			}
			
		}
		
		/**
		 * I know this might not be Doing It Right(tm), but his is my work around because I can't figure out how to render
		 * link items from "1" to this.props.currentPage without using the .map function in the return statement. I've
		 * tried another component, a function inside of this component but I can't get everything hooked up correctly.
		 *
		 * Creating an array to use the map function with - someone please tell me how to do this the right way :)
		 */
		for (var i = startPage; i <= endPage; i++) {
			pages.push(i);
		}
		
		return pages;
	}
	
	render() {
		
		if ( this.props.totalPages > 1 ) {
			
			var pages = this.getPagerData();
			
			return (
				<nav aria-label="Page navigation">
					<ul className="posts-grid-pagination">
						
						{/** Build the "Prev" link **/}
						{(() => {
							if ( this.props.currentPage == 1 ) {
								var disabled = "disabled";
								var prevPage = 1;
							}else {
								var disabled = "";
								var prevPage = this.props.currentPage - 1;
							}
							
							return <li className={disabled + " page-item"}><a href="#" className="page-link" onClick={(e) => this.changePage(prevPage, e, disabled)}>&lt; Prev</a></li>
						})()}
						
						{pages.map(key => {
							
							if ( key == this.props.currentPage ) {
								return <li className={"page-item currentPage active"} key={key} data-page={key}><a href="#" className="page-link" onClick={(e) => this.changePage(key, e)}>{key}</a></li>
							} else {
								return <li className={"page-item"} key={key}><a href="#" className="page-link" onClick={(e) => this.changePage(key, e)}>{key}</a></li>
							}
							
						})}
						
						{/** Build the "Next" link **/}
						{(() => {
							if ( this.props.currentPage == this.props.totalPages ) {
								var disabled = "disabled";
								var nextPage = this.props.totalPages;
							}else {
								var disabled = "";
								var nextPage = this.props.currentPage + 1;
							}
							
							return <li className={disabled + " page-item"}><a href="#" className="page-link" onClick={(e) => this.changePage(nextPage, e, disabled)}>Next &gt;</a></li>
						})()}
						
					</ul>
				</nav>
			);
		} else {
			return (<div className="posts-grid-pagination empty"></div>);
		}
		
	}
		
}

class PostsGridApp extends React.Component {
	
	constructor( props ) {
		super(props);
		
		this.state = {
			categories: [],
			selectedCategory: { id: '-1' },
			headerText: "",
			posts: [],
			page: 1,
			totalPages: 1,
			postType: this.props.postType || 'post',
			taxonomy: this.props.taxonomy || 'category',
			perPage: this.props.perPage || 6,
			imgSize: this.props.imgSize || 'medium',
			headerTextStart: "Now showing posts from: ",
		};
		
		this.setCategorySelectOptions();
	}
	
	setCategorySelectOptions() {
		
		axios.get( '/wp-json/wp/v2/categories' )
			.then(res => {
				this.setState({
					'categories': res.data,
				});
			});
			
	}
	
	onCategorySelect(id, option) {
		
		var thisHeaderText;
		
		if ( id == -1 ) {
			thisHeaderText = ""
		} else if ( id == 0 ) {
			thisHeaderText = "Now showing all posts:";
		} else {
			thisHeaderText = this.state.headerTextStart + option.name;
		}
		
		this.setState({
			selectedCategory: option,
			headerText: thisHeaderText,
		}, function(){
			this.updatePosts();
		});
		
	}
	
	onPageNavigation(page) {
		
		this.setState({
			page: page
		}, function(){
			this.updatePosts();
		});
		
	}
	
	updatePosts() {
		
		var catID = this.state.selectedCategory.id;
		var catQuery = '';
		
		if ( typeof catID !== 'undefined' )
			catQuery = '&categories=' + catID;
		
		if ( this.state.page > 1 ) {
			
			catQuery += '';
			
		}
		
		axios.get( '/wp-json/wp/v2/posts?per_page=' + this.state.perPage + '&page=' + this.state.page + catQuery + '&_embed' )
			.then(res => {
				this.setState({
					'posts': res.data,
					'totalPages': parseInt(res.headers['x-wp-totalpages']),
				});
			});
		
	}
	
	render() {
		return (
			<div className="postsgrid">
				<PostCategorySelect categories={this.state.categories} onCategorySelect={this.onCategorySelect.bind(this)} value={this.state.selectedCategory.id} />
				<h3>{this.state.headerText}</h3>
				<PostsGrid  posts={this.state.posts} selectedCatID={this.state.selectedCategory.id} imgSize={this.state.imgSize} />
				<PostsGridPagination totalPages={this.state.totalPages} currentPage={this.state.page} pageSize={this.state.perPage} onPageNavigation={this.onPageNavigation.bind(this)} />
			</div>
		);
	}
}

// ========================================
/**
 * I'm adding some props to the main app here, just to be clear what is "configurable." I'm setting defaults in the main app constructor, 
 * so no props _need_ to be set here, just illustrating that they _can_ be set here. I'm sure you could work this to take shortcode attributes,
 * create a global JS variable and pull data from that to populate the "options" here. Also, I'm not using "postType" or "taxonomy" yet, as the 
 * code around the api calls gets a little more complex, especially if you want to accept multiple post types or taxonomies.
 **/
ReactDOM.render(
	<PostsGridApp postType="post" taxonomy="category" perPage={6} imgSize="medium" />,
	document.getElementById('react-postgrid-wrap')
);
