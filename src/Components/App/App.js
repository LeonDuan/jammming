import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

Spotify.getAccessToken();

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: 'New Playlist',
    }

    // bindings
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults tracks={this.state.searchResults} onAdd={this.addTrack} onRemove={this.removeTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} onAdd={this.addTrack} onRemove={this.removeTrack}/>
          </div>
        </div>
      </div>
    );
  }

  addTrack(track){
    for(let i = 0; i < this.state.playlistTracks.length; i++){
      var curTrackInList = this.state.playlistTracks[i];
      if(curTrackInList.id === track.id){
        alert("This track was already added!")
        return;
      }
    }
    this.setState({playlistTracks: this.state.playlistTracks.concat(track)});
  }

  removeTrack(track){
    for(let i = 0; i < this.state.playlistTracks.length; i++){
      var curTrackInList = this.state.playlistTracks[i];
      if(curTrackInList.id === track.id){
        this.state.playlistTracks.splice(i, 1);
        this.render();
        break;
      }
    }
    this.setState(this.state.playlistTracks);
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    Spotify.savePlaylist(
      this.state.playlistName,
      this.state.playlistTracks.map((track) => {
        return track.uri;
      })
    );
    this.setState({searchResults: []});
    this.setState({playlistName: 'New Playlist'});
    this.setState({playlistTracks: []});
  }

  search(term){
    Spotify.search(term).then((searchResults) => {
      this.setState({searchResults: searchResults});
    });
  }
}
