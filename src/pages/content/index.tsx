import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { addCommentToLocalStorage, addPostToLocalStorage, fetchGeminiSuggestion, updateFollowerAndConnectionCountInLocalStorage } from "@src/lib/lib";

// Ensure we don't inject multiple root elements
if (!document.getElementById("__react_root")) {
  const div = document.createElement("div");
  div.id = "__react_root";
  document.body.appendChild(div);
}

const rootContainer = document.querySelector("#__react_root");
if (!rootContainer) throw new Error("Can't find Content root element");

const root = createRoot(rootContainer);


const App = () => {
  const [postData, setPostData] = useState<string | null>(null);
  const [generatedComment, setGeneratedComment] = useState<string | null>(null);
  const [activeTextBox, setActiveTextBox] = useState<HTMLElement | null>(null);
  
  const useURLChange = (callback: () => void) => {
    useEffect(() => {
      let lastUrl = window.location.href;
  
      const handleChange = () => {
        if (window.location.href !== lastUrl) {
          lastUrl = window.location.href;
  
          // Wait for the page to be fully loaded
          if (document.readyState === "complete") {
            callback();
          } else {
            const checkIfLoaded = setInterval(() => {
              if (document.readyState === "complete") {
                clearInterval(checkIfLoaded);
                callback();
              }
            }, 500);
          }
        }
      };
  
      // Run on initial load
      handleChange();
  
      // Detect SPA-style URL changes
      const observer = new MutationObserver(handleChange);
      observer.observe(document, { subtree: true, childList: true });
  
      return () => observer.disconnect();
    }, []);
  };
  

  const updateUserStats = async ()=>{
    const profileUrl = await chrome.storage.local.get("profileUrl");

    if(!profileUrl){
      console.error("LinkedIn Profile Url not found in local Storage. Please login again")
    }
    if (window.location.href.includes(profileUrl?.profileUrl)) {
      console.log("Updating follower count")

      const connectionsElement = document.querySelector("li.text-body-small") as HTMLElement;
      const connectionsCount = connectionsElement?.innerText.split(" ")[0];
      
      const followersElement = document.querySelector('p a[href*="feed/followers"]') as HTMLElement;
      const followersCount = followersElement?.innerText.split(" ")[0];

      console.log("Follwers and connections : ", followersCount, ", ", connectionsCount)

      if(followersCount && connectionsCount){ 
        updateFollowerAndConnectionCountInLocalStorage(Number(connectionsCount), Number(followersCount));
      }



      const suggestedProfilesList = Array.from(document.querySelectorAll(".pvs-header__left-container--stack")).find((el) => el.textContent?.trim().includes("People you may know"))?.closest(".pv-profile-card")?.querySelector("ul")?.querySelectorAll("li.artdeco-list__item");

      if (suggestedProfilesList) {
        const profiles = Array.from(suggestedProfilesList).map((profileEl) => {
          const links = profileEl.querySelectorAll("a");
          const profileLink = links[0].href;
          const imageElement = links[0]?.outerHTML;
          const hiddenTextElements = links[1]?.querySelectorAll('[aria-hidden="true"]');

          const userName = (hiddenTextElements[0] as HTMLElement)?.innerText || "";
          const description = (hiddenTextElements[1] as HTMLElement)?.innerText || "";

          console.log("Suggested Profiles updated")
      
          return { imageElement, userName, description, profileLink };
        });
      
        // Store data using chrome.storage.local
        chrome.storage.local.set({ suggestedProfiles: profiles }, () => {
          console.log("Profiles saved in Chrome storage:", profiles);
        });
      }
      else {
        console.log("No suggested profiles found.");
      }
    }
  }

  // useEffect(() => {
  //   updateUserStats();
  // }, []);

  useURLChange(updateUserStats);



  const handleCommentButton = async (event: FocusEvent) => {
    console.log("Comment button clicked")    
    const commentResponse = await addCommentToLocalStorage();
    console.log("Comment response", commentResponse);
  };

  const handlePostButton = async (event: MouseEvent) => {
    console.log("Post button clicked");
  
    const target = event.target as HTMLElement;
  
    if (target.classList.contains("artdeco-button--disabled")) {
      console.log("Button is disabled");
    } else {
    
      
      const postResponse = await addPostToLocalStorage();
      console.log("POST response", postResponse);
    }
  };

  const fetchSuggestion = async () => {
    if (postData) {
      const response = await fetchGeminiSuggestion(postData);
      console.log("Generated Comment:", response);
      setGeneratedComment(response);
    }
  };


  
  const handleAiButtonClick = (event : FocusEvent)=>{
   
    const button = event.target as HTMLElement;
    const textBox = button.closest(".comments-comment-box-comment__text-editor") as HTMLElement;
    if(textBox){
      setActiveTextBox(textBox);
    }

     // Find the nearest post container and extract the description
     const postContainer = textBox.closest(".feed-shared-update-v2");
     const description = postContainer?.querySelector(".feed-shared-update-v2__description")?.textContent?.trim();

     
     setPostData(description || null);
  }

  useEffect(() => {
    const handleBlur = (event: FocusEvent) => {
      const textBox = event.target as HTMLElement;
      textBox?.querySelector(".ai-icon")?.remove();
    };

    const attachEventListeners = () => {
      const textBoxList = document.querySelectorAll(".comments-comment-box-comment__text-editor");
      textBoxList.forEach((textBox) => {
        if (!(textBox as HTMLElement).dataset.listenerAdded) {

          if (!textBox.querySelector(".ai-icon")) {
            const iconsContainer = textBox?.parentElement?.querySelector(".display-flex.justify-space-between")?.querySelector(".display-flex")


            const container = document.createElement("div");
            container.className = "ai-icon";
            container.setAttribute(
              "style",
              "display: flex; align-items: center; justify-content: center; height: 100%; "
            );
    
            const button = document.createElement("button");
            button.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightbulb-fill" viewBox="0 0 16 16"><path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5"/></svg>';

            button.classList.add("ai-suggest-btn");

            button.addEventListener("click", handleAiButtonClick);

            container.appendChild(button);
            iconsContainer?.appendChild(container);
          }

          
          (textBox as HTMLElement).dataset.listenerAdded = "true";
          (textBox as HTMLElement).addEventListener("blur", handleBlur);
        }
      });

      const commentSubmitButtons = document.querySelectorAll('.comments-comment-box__submit-button--cr.artdeco-button--primary')
      commentSubmitButtons.forEach((button) =>{
        if(!(button as HTMLElement).dataset.listenerAdded){
          (button as HTMLElement).dataset.listenerAdded = "true";
          (button as HTMLElement).addEventListener("click", handleCommentButton);
        }
      })

      const postButtons = document.querySelectorAll(".share-box_actions button")
      postButtons.forEach((button)=>{
        (button as HTMLElement).addEventListener("click", handlePostButton)
      })
    };

    const observeDOMChanges = () => {
      const observer = new MutationObserver(() => {
        attachEventListeners();
      });

      observer.observe(document.body, { childList: true, subtree: true });
      return observer;
    };

    // Initial listener attachment
    attachEventListeners();
    const observer = observeDOMChanges();

    return () => {
      observer.disconnect(); // Cleanup MutationObserver when unmounting
      document.querySelectorAll(".comments-comment-box-comment__text-editor").forEach((textBox) => {
        (textBox as HTMLElement).removeEventListener("blur", handleBlur);
      });
    };
  }, []);

  useEffect(() => {
    fetchSuggestion();
  }, [postData]); // Fetch suggestion only when postData changes

  // Insert generated comment into the text box
  useEffect(() => {
    if (generatedComment && activeTextBox) {
      const textArea = activeTextBox.getElementsByTagName("p");

      if (textArea.length > 0) {
        textArea[0].textContent = ""; // Clear existing content
        textArea[0].textContent =" Generating Comment ...."
      }

      setTimeout(() => {
      if (textArea[0]) {
        textArea[0].textContent = generatedComment;
      }
    }, 2000);

      const aiIcon = activeTextBox.getElementsByClassName("ai-icon");
      if (aiIcon.length > 0) {
        aiIcon[0].remove(); // Remove the first AI button
      }

      setGeneratedComment(""); // Reset generated comment after insertion
    }
  }, [generatedComment, activeTextBox]);

  
  return (
    <div>
    </div>
  );
};

root.render(<App />);
