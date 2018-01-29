import React, {Component} from 'react';
import './Playlist.css'
import TrackList from '../TrackList/TrackList'

export default class Playlist extends Component {
  constructor(props){
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  render(){
    return (
      <div className="Playlist">
        <input value={this.props.playlistName} onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.playlistTracks} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={true}/>
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }

  handleNameChange(e){
    this.props.onNameChange(e.target.value);
  }
}
