import React, {Component} from 'react';
import './SearchBar.css'

export default class SearchBar extends Component {
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }
  render(){
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }

  search(){
    this.props.onSearch(this.state.term);
  }

  handleTermChange(e){
    this.setState({term: e.target.value});
  }
}
