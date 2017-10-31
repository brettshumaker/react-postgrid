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