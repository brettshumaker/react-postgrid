import PostCategorySelect from './components/PostCategorySelect';
import PostsGrid from './components/PostsGrid';
import PostsGridPagination from './components/PostsGridPagination';

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