import React, { useEffect, useState } from "react";

const StatsGrid = ({timeframe} : {timeframe : string}) => {
  const [commentsPosted, setCommentsPosted] = useState(0);
  const [postsPublished, setPostsPublished] = useState(0);
  const [newConnections, setNewConnections] = useState(0);
  const [newFollowers, setNewFollowers] = useState(0);

  useEffect(() => {
    // Get the cutoff time for filtering
    const currentTime = new Date().getTime();
    let cutoffTime: number;

    switch (timeframe) {
      case "Last 7 days":
        cutoffTime = currentTime - 7 * 24 * 60 * 60 * 1000;
        break;
      case "Last 30 days":
        cutoffTime = currentTime - 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        cutoffTime = currentTime - 24 * 60 * 60 * 1000;
        break;
    }

    const updateStatsCount = async()=>{

 

    // Function to filter timestamps and count recent entries
    const filterRecent = (timestamps: string[]) =>
      timestamps.filter((ts) => new Date(ts).getTime() >= cutoffTime).length;

    // Fetch & filter comment timestamps
    await chrome.storage.local.get(["commentTimestamps"], (result) => {
      const timestamps = result.commentTimestamps || [];
      setCommentsPosted(filterRecent(timestamps));
    });

    // Fetch & filter post timestamps
    await chrome.storage.local.get(["postTimeStamps"], (result) => {
      const timestamps = result.postTimeStamps || [];
      setPostsPublished(filterRecent(timestamps));
    });

    // Fetch & calculate net gained followers and connections
    await chrome.storage.local.get(["connectionData"], (result) => {
      const connectionData: { connectionCount: number; followersCount: number; timestamp: string }[] = 
        result.connectionData || [];

      // Filter entries within the selected timeframe
      const filteredData = connectionData.filter((entry) => new Date(entry.timestamp).getTime() >= cutoffTime);

      if (filteredData.length > 0) {
        // Get the earliest and latest available entries within the timeframe
        const earliestEntry = filteredData[0];
        const latestEntry = filteredData[filteredData.length - 1];

        // Calculate the net gain
        const gainedConnections = latestEntry.connectionCount - earliestEntry.connectionCount;
        const gainedFollowers = latestEntry.followersCount - earliestEntry.followersCount;

        setNewConnections(gainedConnections);
        setNewFollowers(gainedFollowers);
      } else {
        setNewConnections(0);
        setNewFollowers(0);
      }


    });
    }

    updateStatsCount();
  }, [timeframe]);

  const stats = [
    { value: newConnections, label: "New Connections" },
    { value: newFollowers, label: "New Followers" },
    { value: commentsPosted, label: "Comments Posted" },
    { value: postsPublished, label: "Posts & Articles Published" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 px-4 py-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col justify-end items-start p-4 h-28 border-[#efefef] bg-[#f9fbfc] border rounded-lg shadow-sm"
        >
          <span className="text-2xl font-bold text-blue-600">{stat.value}</span>
          <span className="text-gray-600 text-[10px]">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
