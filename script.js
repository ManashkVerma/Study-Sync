document.addEventListener("DOMContentLoaded", function () {
  const mainContent = document.getElementById("mainContent");
  const addProjectBtn = document.getElementById("addProjectBtn");
  const addYoutubeProjectBtn = document.getElementById("addYoutubeProjectBtn");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const projectList = document.getElementById("projectList");
  const youtubeDialogOverlay = document.getElementById("youtubeDialogOverlay");
  const youtubeDialog = document.getElementById("youtubeDialog");
  const youtubePlaylistInput = document.getElementById("youtubePlaylistInput");
  const youtubeDialogCancel = document.getElementById("youtubeDialogCancel");
  const youtubeDialogAdd = document.getElementById("youtubeDialogAdd");

  let projects = [
    {
      title: "Study Planner",
      content: "Organize your study schedule and set reminders.",
      tasks: ["Read Chapter 1", "Make notes", "Set reminders"],
      completed: [],
    },
    {
      title: "Assignment Tracker",
      content: "Track assignments and due dates easily.",
      tasks: ["Math HW", "Science Project"],
      completed: [],
    },
    {
      title: "Exam Prep Board",
      content: "Prepare for exams with to-do lists and notes.",
      tasks: ["Revise Biology", "Practice Math"],
      completed: [],
    },
  ];

  function renderSidebar() {
    projectList.innerHTML = "";
    projects.forEach((proj, idx) => {
      const li = document.createElement("li");
      li.textContent = proj.title;
      const editIcon = document.createElement("span");
      editIcon.className = "edit-icon";
      editIcon.title = "Edit name";
      editIcon.innerHTML = "&#9998;";
      editIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        makeTitleEditableSidebar(li, idx);
      });
      const deleteIcon = document.createElement("span");
      deleteIcon.className = "delete-icon";
      deleteIcon.title = "Delete project";
      deleteIcon.innerHTML = "&#128465;";
      deleteIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        deleteProject(idx);
      });
      li.appendChild(editIcon);
      li.appendChild(deleteIcon);
      li.setAttribute("data-project-id", idx);
      projectList.appendChild(li);
    });
  }

  function renderMain() {
    mainContent.innerHTML = "";
    projects.forEach((proj, idx) => {
      mainContent.appendChild(
        createProjectCard(
          proj.title,
          proj.content,
          idx,
          proj.tasks,
          proj.completed,
          proj.special,
          proj.youtubePlaylist
        )
      );
    });
  }

  function createProjectCard(
    title = "New Project",
    content = "Describe your project here...",
    idx,
    tasks = [],
    completed = [],
    special = false,
    youtubePlaylist = null
  ) {
    const card = document.createElement("div");
    card.className = "project-card" + (special ? " special-project" : "");
    card.innerHTML = `
      <div class="project-card-title" data-project-id="${idx}">${title}
        <span class="edit-icon" title="Edit name">&#9998;</span>
        <span class="delete-icon" title="Delete project">&#128465;</span>
      </div>
      <div class="project-card-content">${content}</div>
      <ul class="task-list" id="taskList-${idx}">
        ${tasks
          .map(
            (task, tIdx) => `
          <li data-task-idx="${tIdx}">
            <button class="task-complete-btn" title="Mark as complete">&#9675;</button>
            <span class="task-text">${task}</span>
          </li>
        `
          )
          .join("")}
      </ul>
      <div class="add-task-row">
        <input type="text" class="add-task-input" placeholder="Add a task..." />
        <button class="add-task-btn">+</button>
      </div>
      <div class="completed-toggle-row">
        <button class="toggle-completed-btn">Show Completed Tasks</button>
      </div>
      <ul class="completed-list" id="completedList-${idx}" style="display:none;">
        ${completed
          .map(
            (task, tIdx) => `
          <li data-completed-idx="${tIdx}">
            <button class="restore-task-btn" title="Restore">&#8634;</button>
            <span class="task-text completed">${task}</span>
          </li>
        `
          )
          .join("")}
      </ul>
    `;
    card.querySelector(".edit-icon").addEventListener("click", function (e) {
      e.stopPropagation();
      makeTitleEditableMain(card, idx);
    });
    card
      .querySelector(".project-card-title")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        makeTitleEditableMain(card, idx);
      });
    const addTaskBtn = card.querySelector(".add-task-btn");
    const addTaskInput = card.querySelector(".add-task-input");
    const taskList = card.querySelector(".task-list");
    addTaskBtn.addEventListener("click", function () {
      const val = addTaskInput.value.trim();
      if (val) {
        projects[idx].tasks.push(val);
        renderMain();
      }
    });
    addTaskInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        addTaskBtn.click();
      }
    });
    card.querySelectorAll(".task-complete-btn").forEach((btn, tIdx) => {
      btn.addEventListener("click", function () {
        const task = projects[idx].tasks.splice(tIdx, 1)[0];
        projects[idx].completed.push(task);
        renderMain();
      });
    });
    const toggleCompletedBtn = card.querySelector(".toggle-completed-btn");
    const completedList = card.querySelector(".completed-list");
    let completedVisible = false;
    toggleCompletedBtn.addEventListener("click", function () {
      completedVisible = !completedVisible;
      completedList.style.display = completedVisible ? "block" : "none";
      toggleCompletedBtn.textContent = completedVisible
        ? "Hide Completed Tasks"
        : "Show Completed Tasks";
    });
    card.querySelectorAll(".restore-task-btn").forEach((btn, cIdx) => {
      btn.addEventListener("click", function () {
        const task = projects[idx].completed.splice(cIdx, 1)[0];
        projects[idx].tasks.push(task);
        renderMain();
      });
    });
    card.querySelector(".delete-icon").addEventListener("click", function (e) {
      e.stopPropagation();
      deleteProject(idx);
    });
    return card;
  }

  function makeTitleEditableSidebar(li, idx) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = projects[idx].title;
    input.className = "edit-title-input";
    li.textContent = "";
    li.appendChild(input);
    input.focus();
    input.select();
    input.addEventListener("blur", function () {
      projects[idx].title = input.value || "Untitled Project";
      renderSidebar();
      renderMain();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        input.blur();
      }
    });
  }

  function makeTitleEditableMain(card, idx) {
    const titleDiv = card.querySelector(".project-card-title");
    const input = document.createElement("input");
    input.type = "text";
    input.value = projects[idx].title;
    input.className = "edit-title-input";
    titleDiv.textContent = "";
    titleDiv.appendChild(input);
    input.focus();
    input.select();
    input.addEventListener("blur", function () {
      projects[idx].title = input.value || "Untitled Project";
      renderSidebar();
      renderMain();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        input.blur();
      }
    });
  }

  function deleteProject(idx) {
    projects.splice(idx, 1);
    renderSidebar();
    renderMain();
  }

  renderSidebar();
  renderMain();

  addProjectBtn.addEventListener("click", function () {
    projects.push({
      title: "New Project",
      content: "Describe your project here...",
      tasks: [],
      completed: [],
      special: false,
    });
    renderSidebar();
    renderMain();
    mainContent.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  addYoutubeProjectBtn.addEventListener("click", function () {
    youtubePlaylistInput.value = "";
    youtubeDialogOverlay.style.display = "flex";
    youtubePlaylistInput.focus();
  });

  youtubeDialogCancel.addEventListener("click", function () {
    youtubeDialogOverlay.style.display = "none";
  });

  youtubeDialogAdd.addEventListener("click", async function () {
    const playlistUrl = youtubePlaylistInput.value.trim();
    if (playlistUrl) {
      let playlistTitle = "Special Project";
      let videoTitles = [];
      try {
        const oembedResp = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(
            playlistUrl
          )}&format=json`
        );
        if (oembedResp.ok) {
          const oembedData = await oembedResp.json();
          if (oembedData.title) playlistTitle = oembedData.title;
        }
      } catch {}
      try {
        const match = playlistUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
        if (match) {
          const rssResp = await fetch(
            `https://www.youtube.com/feeds/videos.xml?playlist_id=${match[1]}`
          );
          if (rssResp.ok) {
            const rssText = await rssResp.text();
            const parser = new window.DOMParser();
            const xml = parser.parseFromString(rssText, "application/xml");
            const entries = xml.querySelectorAll("entry");
            videoTitles = Array.from(entries).map((entry) => {
              const title = entry.querySelector("title");
              const link = entry.querySelector("link");
              return link
                ? `<a href='${link.getAttribute("href")}' target='_blank'>${
                    title.textContent
                  }</a>`
                : title.textContent;
            });
          }
        }
      } catch {}
      if (videoTitles.length === 0) {
        for (let i = 1; i <= 5; i++) {
          videoTitles.push(`Video ${i} (demo)`);
        }
      }
      projects.push({
        title: playlistTitle,
        content: "YouTube Playlist Tasks",
        tasks: videoTitles,
        completed: [],
        special: true,
        youtubePlaylist: playlistUrl,
      });
      renderSidebar();
      renderMain();
      mainContent.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    youtubeDialogOverlay.style.display = "none";
  });

  youtubePlaylistInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      youtubeDialogAdd.click();
    }
  });

  youtubeDialogOverlay.addEventListener("click", function (e) {
    if (e.target === youtubeDialogOverlay) {
      youtubeDialogOverlay.style.display = "none";
    }
  });

  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    sidebarToggle.style.display = sidebar.classList.contains("active")
      ? "none"
      : "block";
  });

  document.addEventListener("click", function (e) {
    if (
      window.innerWidth <= 1100 &&
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      e.target !== sidebarToggle
    ) {
      sidebar.classList.remove("active");
      sidebarToggle.style.display = "block";
    }
  });
});
