let baseUrl = "http://localhost:5000";
let blogs = [];

const getMyElementByItsId = (id) => {
  return document.getElementById(id);
};
const toggleMenu = getMyElementByItsId("toggleMenu");
const toggleMenuIcon = getMyElementByItsId("toggleMenuIcon");
const imageUploader = getMyElementByItsId("imageUploader");

let coverImageURL = null;

// Dark Mode
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  //   check the user preferences
  const currentmode = localStorage.getItem("mode");
  console.log("Current Mode : ", currentmode);

  if (currentmode === "dark") {
    body.classList.add("dark");
  }

  //   toggle between the dark and light
  toggleMenu.addEventListener("click", () => {
    console.log("Current Mode : ", currentmode);

    toggleMenuIcon.classList.toggle("bxs-sun");
    body.classList.toggle("dark");
    // Update the user's preference in localStorage
    localStorage.setItem(
      "mode",
      body.classList.contains("dark") ? "dark" : "light"
    );
  });

  // Creating new blogs/////////////////////////////////////////////////
  fetchBlogs()
    .then((data) => {
      blogs = data;
      console.log(blogs);
      buildAdminBlogCards(blogs);
    })
    .catch((error) => {
      console.log(error);
    });
  const createBlog = async () => {
    const title = document.getElementById("blogTitle").value;
    const description = document.getElementById("description").value;
    const content = document.getElementById("content").value;

    // Create a new FormData object to handle file uploads
    const data = {
      title,
      description,
      cover_image: coverImageURL,
      content,
    };
    console.log(data);

    try {
      const response = await fetch(`${baseUrl}/api/blogs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      // Blog created successfully, update UI or perform additional actions if needed
      // fetchBlogs()
      //   .then((data) => {
      //     blogs = data;
      //     console.log(blogs);
      //     buildAdminBlogCards(blogs);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // Add an event listener to the submit button
  const submitButton = document.getElementById("createBlog");
  submitButton.addEventListener("click", createBlog);
});

const deleteImageUrl = () => {
  coverImageURL = null;
  const imageUploadContainer = getMyElementByItsId("imageUploadContainer");

  imageUploadContainer.innerHTML = `
    <div
    class="w-full h-full flex flex-col items-center justify-center"
    >
    <i
        class="bx bxs-cloud-upload text-slate-800 dark:text-slate-400 text-2xl"
    ></i>
    <p class="text-slate-800 dark:text-slate-400">Click to upload</p>
    </div>
    <input
    type="file"
    accept="image/*"
    class="w-0 h-0"
    id="imageUploader"
    />
  `;
};

// function to fetch the data from the server
const fetchBlogs = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/blogs`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

const generateAdminBlogCards = (data, index) => {
  return `
  <div id="${data.id}" class="adminCard p-2 gap-2 relative" >
    <div class="absolute top-4 right-4 p-3 rounded-full bg-red-500 flex items-center justify-center cursor-pointer" onclick="deleteTheBlogById(${index})">
    <i class='bx bxs-trash-alt'></i>
    </div>
    <div class="w-full h-full rounded-md flex items-center justify-center">
      <img src="${data.cover_image}" class="w-full h-auto lg:h-44 rounded-md object-cover" alt="">
    </div>
    <p class="w-full truncate text-center">${data.title}</p>
  </div>
  `;
};

const buildAdminBlogCards = () => {
  const adminRightContainer = getMyElementByItsId("adminRightContainer");
  adminRightContainer.innerHTML = "";
  if (blogs.length > 0) {
    blogs.forEach((blog, index) => {
      adminRightContainer.innerHTML += generateAdminBlogCards(blog, index);
    });
  } else {
    adminRightContainer.innerHTML = "<p>No blog data</p>";
  }
};

const deleteTheBlogById = async (index) => {
  const blog = blogs[index];
  // console.log(`${baseUrl}/api/blogs/${blog.id}`);

  try {
    const response = await fetch(`${baseUrl}/api/blogs/${blog.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // console.log(`Blog entry with ID ${id} deleted successfully.`);
    fetchBlogs()
      .then((data) => {
        blogs = data;
        console.log(blogs);
        buildAdminBlogCards(blogs);
      })
      .catch((error) => {
        console.log(error);
      });
    // Optionally, you can perform additional actions after successful deletion.
  } catch (error) {
    console.log(error);
  }
};
