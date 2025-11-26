import React from "react";

export default function Profile() {
  return (
    <div className="w-full bg-gray-100 pb-20">
      {/* Banner */}
      <div className="w-full h-60 bg-gray-300 relative">
        <img
          src="https://via.placeholder.com/800x200"
          alt="banner"
          className="w-full h-full object-cover"
        />

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-10">
          <img
            src="https://via.placeholder.com/150"
            alt="profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-20 px-4">
        {/* Top Info Section */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h1 className="text-2xl font-bold">Sonal Verma ✔</h1>
          <p className="text-gray-700 mt-1">
            Attended Allenhouse Institute of Technology · India
          </p>
          <p className="text-gray-500 text-sm">Kanpur, Uttar Pradesh · Contact info</p>
          <p className="text-blue-600 text-sm font-semibold mt-1">500+ connections</p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Open to
            </button>
            <button className="border px-4 py-2 rounded-lg">Add profile section</button>
            <button className="border px-4 py-2 rounded-lg">Enhance profile</button>
            <button className="border px-4 py-2 rounded-lg">Resources</button>
          </div>

          {/* Open to Work Box */}
          <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold">Open to work</h3>
            <p className="text-sm text-gray-600">
              Student roles · Software · Frontend Developer · Internships
            </p>
            <button className="text-blue-600 text-sm font-medium mt-1">
              Show details
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg p-6 shadow mt-6">
          <h2 className="text-lg font-bold">About</h2>
          <p className="text-gray-700 mt-2">
            Passionate frontend developer skilled in React, JavaScript, Tailwind,
            APIs, and building real-world projects like YouTube clone, Netflix clone,
            dashboard systems, and more.
          </p>
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-lg p-6 shadow mt-6">
          <h2 className="text-lg font-bold">Activity</h2>
          <p className="text-blue-600 font-semibold mt-1">500 followers</p>

          <div className="mt-4">
            <p class="text-gray-600">You haven’t posted recently</p>
            <p className="text-blue-600 text-sm mt-1">Start a post</p>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg p-6 shadow mt-6">
          <h2 className="text-lg font-bold">Education</h2>

          <div className="mt-4 flex gap-4">
            <img
              src="https://via.placeholder.com/60"
              className="w-14 h-14 rounded"
            />
            <div>
              <h3 className="font-semibold">Allenhouse Institute of Technology</h3>
              <p className="text-gray-600 text-sm">B.Tech · Computer Science</p>
              <p className="text-gray-500 text-sm">2021 – 2025</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg p-6 shadow mt-6">
          <h2 className="text-lg font-bold">Skills</h2>

          <div className="mt-4 flex flex-wrap gap-3">
            {/* Add your skills */}
            {["React", "JavaScript", "Node.js", "Tailwind", "APIs"].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-gray-200 rounded-full text-gray-700 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
