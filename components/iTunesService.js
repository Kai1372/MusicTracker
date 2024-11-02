export const fetchSongs = async (searchTerm) => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=25`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const fetchAlbums = async (searchTerm) => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=album&limit=25`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

export const fetchAlbumsByIds = async (albumIds) => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?amgAlbumId=${albumIds.join(',')}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchSongsByIds = async (songIds) => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${songIds.join(',')}&entity=song`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


  const generateRandomIds = (count, maxId) => {
    const randomIds = [];
    for (let i = 0; i < count; i++) {
      randomIds.push(Math.floor(Math.random() * maxId) + 1);
    }
    return randomIds;
  };