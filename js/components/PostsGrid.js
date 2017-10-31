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