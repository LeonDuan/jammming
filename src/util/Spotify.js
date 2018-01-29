let accessToken = '';
let expiresIn = '';
const client_id = '9a6fd3ca23094c638e5ae84e57807ba6';
const redirect_uri = 'http://localhost:3000/';

var Spotify = {
  getAccessToken() {
    // if there is a valid access token
    if (accessToken !== ''){
      return accessToken;
    }

    let accessTokenMatches = window.location.href.match(/access_token=([^&]*)/);
    let expiresInMatches = window.location.href.match(/expires_in=([^&]*)/);
    // if the token was just acquired
    if (accessTokenMatches && expiresInMatches){
      accessToken = accessTokenMatches[0].replace('access_token=', '');
      expiresIn = expiresInMatches[0].replace('expires_in=', '');
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    }
    // there is no valid token, and no token was just acquried
    else{
      window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
    }
  },

  search(term){
    // get access token before search;
    Spotify.getAccessToken();

    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers:
        {
          Authorization: `Bearer ${accessToken}`
        }
      }
    ).then((response) => {
      return response.json();
    }).then((jsonResponse) => {
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  savePlaylist(playlistName, tracks){
    if(playlistName == null || tracks == null){
      return;
    }

    // step1: get user id
    let headers = {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }

    let userID;
    let playlistID;
    fetch(
      'https://api.spotify.com/v1/me',
      {headers: headers}
    ).then((response) => {
      return response.json();
    }).then((jsonResponse) => {
      userID = jsonResponse.id;
    }).then(() => {
      fetch(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playlistName})
        }
      ).then((response) => {
        return response.json();
      }).then((jsonResponse) => {
        playlistID = jsonResponse.id;
      }).then(() => {
        fetch(
          `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
          {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: tracks})
          }
        )
      });
    });
  }
}

export default Spotify;
