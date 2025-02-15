import React from "react";

function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">About</h1>
      <p className="text-center max-w-2xl">
        This application allows you to find concerts you have attended and search for related YouTube videos. Enter your Setlist.fm username to get started.
      </p>
    </div>
  );
}

export default About;