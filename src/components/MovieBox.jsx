import React from "react";

let MovieBox = React.createClass({
    getInitialState() {
        return {
            items: [
            ]
        }
    },
    componentDidMount() {
    },
    componentWillUnmount() {
    },
    render() {
        return (
            <div>
            <h1>
              A long time ago, in a galaxy far far away...
            </h1>
            <p>(Här ska det vara film sen!)</p>
            <video id="example_video_1" class="video-js vjs-default-skin"
                controls preload="auto" width="640" height="264"
                poster="http://video-js.zencoder.com/oceans-clip.png"
                data-setup='{"example_option":true}'>
              <source src="http://video-js.zencoder.com/oceans-clip.mp4" type='video/mp4' />
              <source src="http://video-js.zencoder.com/oceans-clip.webm" type='video/webm' />
              <source src="http://video-js.zencoder.com/oceans-clip.ogv" type='video/ogg' />
              <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
            </video>
            </div>
        );
    }
});

export default MovieBox;
