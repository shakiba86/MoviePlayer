let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek-slider");
let volume_slider = document.querySelector(".volume-slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration"); //total length of the track in seconds
let wave = document.querySelector(".wave");
let randomIcon = document.querySelector(".fa-random");
//create tag audio automatically
let curr_track = document.createElement("audio");

let track_index = 0;
let isPlaying = false; // music is currently playing?
let isRandom = false; // is random mode enabled.
let updateTimer; //create timer for updating ui

const music_list = [
  {
    img: "assets/images/dariush.jpg",
    name: "Ey Eshgh",
    artist: "Dariush",
    music: "assets/music/ey eshgh.mp3",
  },
  {
    img: "assets/images/dariiush.jpg",
    name: " Ejazeh",
    artist: "Dariush",
    music: "assets/music/Ejazeh.mp3",
  },
  {
    img: "assets/images/aslani.jpg",
    name: "Age Ye Rooz",
    artist: "Aslani",
    music: "assets/music/Age Ye Rooz.mp3",
  },

  {
    img: "assets/images/hayedeh.jpg",
    name: "Bahooneh",
    artist: "Hayedeh",
    music: "assets/music/Bahooneh.mp3",
  },
  {
    img: "assets/images/hayedehh.jpg",
    name: "asemoon",
    artist: "Hayedeh",
    music: "assets/music/asemoon.mp3",
  },
  {
    img: "assets/images/sheibani.jpg",
    name: "Simin Bari ",
    artist: "Jamshid Sheybani",
    music: "assets/music/Simin Bari .mp3",
  },
  {
    img: "assets/images/vigen.jpg",
    name: "shaneh",
    artist: "vigen",
    music: "assets/music/vigen.mp3",
  },
];

function loadTrack(track_index) {
  clearInterval(updateTimer); // Clear any existing interval
  reset(); // Reset seek slider and time display

  // Set the source and load the audio-at first we haveto load track and after play
  curr_track.src = music_list[track_index].music;
  curr_track.load();

  // Update the UI with the current track details
  track_art.style.backgroundImage = `url(${music_list[track_index].img})`;
  track_name.textContent = music_list[track_index].name;
  track_artist.textContent = music_list[track_index].artist;
  now_playing.textContent = `Playing ${track_index + 1} of ${
    music_list.length
  }`;

  //  creating the timer for Update the UI periodically with track details
  updateTimer = setInterval(setUpdate, 1000);

  // Automatically play the next track when the current one ends usisng event for audio tag
  curr_track.addEventListener("ended", nextTrack); //state-based event listener--Without this wouldn’t detect the end of the audio
}
// Load and display the initial track
loadTrack(track_index);

function reset() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  wave.classList.add("loader");
  track_art.classList.add("rotate");
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>'; //Update button to "pause"
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  wave.classList.remove("loader"); // Stop the loader animation
  track_art.classList.remove("rotate"); // Stop rotating album art
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>'; // Update button to "Play"
}

function nextTrack() {
  if (isRandom) {
    // Generate an array of all possible index except the current one
    const availableTrack = music_list
      .map((_, index) => index)
      .filter((index) => index !== track_index);

    // Randomly pick an index from the filtered list
    track_index =
      availableTrack[Math.floor(Math.random() * availableTrack.length)];
  } else {
    //  move to the next track
    track_index = track_index + 1 < music_list.length ? track_index + 1 : 0;
  }
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0) {
    track_index -= 1; // Move to the previous track
  } else {
    track_index = music_list.length - 1; // If it's the first track go to the last track
  }
  loadTrack(track_index);
  playTrack();
}
function repeatTrack() {
  loadTrack(track_index); // Reloads the current track
  playTrack(); // Plays the reloaded track
}

function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
  isRandom = true; // Enable random mode
  randomIcon.classList.add("randomActive"); // Highlight the random icon
  nextTrack();
}

function pauseRandom() {
  isRandom = false; // Disable random mode
  randomIcon.classList.remove("randomActive");
}
//allows the user to jump to a specific part of the track.
function seekTo() {
  //curr_track.duration-total length of the track in seconds
  const seekTo = curr_track.duration * (seek_slider.value / 100); // Calculate seek position-create fraction of the total track length
  curr_track.currentTime = seekTo; // Set the new playback position
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100; // Adjust the audio volume
}
//updates the seek bar and time display at regular intervals every second
function setUpdate() {
  if (!isNaN(curr_track.duration)) {
    // Update seek bar and time
    const seekPosition = (curr_track.currentTime / curr_track.duration) * 100;
    seek_slider.value = seekPosition;
    // Update the current time display
    let currentMinutes = Math.floor(curr_track.currentTime / 60); //Calculate Minutes
    let currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );

    // Update the total duration display
    let durationMinutes = Math.floor(curr_track.duration / 60); //Calculate Minutes
    let durationSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    ); //Calculate second

    if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
    if (durationSeconds < 10) durationSeconds = "0" + durationSeconds;

    curr_time.textContent = `${currentMinutes}:${currentSeconds}`;
    total_duration.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}
