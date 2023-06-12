import { getActiveTabUrl } from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = (bookMarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    newBookmarkElement.id = `bookmark-${bookmark.time}`;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    newBookmarkElement.appendChild(bookmarkTitleElement);

    bookMarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (bookmarks) => {
    const bookMarksElement = document.getElementById("bookmarks");
    bookMarksElement.innerHTML = "";
    if (bookmarks.length > 0) {
        for (let i = 0; i < bookmarks.length; i++) {
            const bookmark = bookmarks[i];
            addNewBookmark(bookMarksElement, bookmark);
        }
    } else {
        bookMarksElement.innerHTML = `<h1 class="title"> No bookmarks found </h1>`;
    }
};

const onPlay = e => { };

const onDelete = e => { };

const setBookmarkAttributes = () => { };

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabUrl();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], data => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

            viewBookmarks(currentVideoBookmarks);
        });
    } else {
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = `<h1 class="title"> Open a YouTube video to see bookmarks </h1>`;
    }
});
