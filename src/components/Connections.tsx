import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Profiles {
  imageElement: string;
  userName: string;
  description: string;
  profileLink: string;
}

const Connections = () => {
  const [suggestions, setSuggestions] = useState<Profiles[]>([]);

  const setSuggestedProfiles = async () => {
    try {
      const { suggestedProfiles } = await chrome.storage.local.get("suggestedProfiles");
      setSuggestions(suggestedProfiles || []);
    } catch (error) {
      console.error("Error fetching suggested profiles:", error);
    }
  };

  useEffect(() => {
    setSuggestedProfiles();
  }, []);

  return (
    <motion.div
      key="connections"
      initial={{ opacity: 0, scaleY: 0.8, originY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      layout
      className="flex flex-col min-h-[200px]" // Ensures content doesn’t jump
    >
      <h1 className="w-full text-center text-headingText text-xl">Suggested Profiles</h1>
      <div className="flex flex-col items-center pt-3 px-3 ">
        {suggestions.length > 0 ? (
          suggestions.map((profile, index) => (
            <ProfileCardTest
              key={index}
              imageHTML={profile.imageElement}
              username={profile.userName}
              description={profile.description}
              profileLink={profile.profileLink}
            />
          ))
        ) : (
          <div className='px-7 pt-5 text-center'>
              <p className="text-gray-500 text-center">No suggestions available.</p>
              <p className='text-headingText pt-10'> <span className='text-headingText'> NOTE :</span> Stats and Suggestions not updating? Make sure this URL matches your linkedIn Profile's URL</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Connections;

const ProfileCardTest = ({
  imageHTML,
  username,
  description,
  profileLink,
}: {
  imageHTML: string;
  username: string;
  description: string;
  profileLink: string;
}) => {
  return (
    <motion.div
      layout
      className="w-full h-20 bg-white shadow-lg rounded-lg px-3 py-2 border-2 border-[#efefef] flex items-center gap-3"
    >
      {/* Image Element */}
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <div dangerouslySetInnerHTML={{ __html: imageHTML }} />
      </div>

      {/* User Data */}
      <a
        className="flex flex-col overflow-hidden w-[calc(100%-3.5rem)]"
        href={profileLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="text-start font-medium truncate text-headingText">{username}</div>
        <div className="text-gray-500 text-start text-sm truncate w-full">{description}</div>
      </a>
    </motion.div>
  );
};
