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