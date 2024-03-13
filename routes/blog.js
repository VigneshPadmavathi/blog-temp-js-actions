const router = require("express").Router();
const fs = require("fs");
const cors = require("cors")({ origin: true });

const filePath = "data.json";

let blogs = [];

//Load data from local json file
// for showing errors
try {
  const data = fs.readFileSync(filePath, "utf8");
  blogs = JSON.parse(data);
} catch (error) {
  console.error("Error reading data from file:", error);
}

/// Save data to the local JSON file
const saveDataToFile = () => {
  const data = JSON.stringify(blogs, null, 2);
  fs.writeFileSync(filePath, data, "utf8");
};

// to get all the blogs
router.get("/", async (req, res) => {
  cors(req, res, async () => {
    return res.status(200).json(blogs);
  });
});

//to get blog by id
router.get("/:id", async (req, res) => {
  cors(req, res, async () => {
    const { id } = req.params;
    // const { title } = req.query;
    const data = blogs.find((item) => item.id === id);
    if (!data) {
      return res.status(404).json({ error: `${id} is not found` });
    }
    return res.status(200).json(data);
  });
});

// create route
router.post("/create", async (req, res) => {
  cors(req, res, async () => {
    console.log(`Body Data : `, req.body);
    const { title, content, cover_image, description } = req.body;
    const newBlog = {
      id: Date.now().toString(),
      title,
      content,
      cover_image,
      description,
    };

    blogs.unshift(newBlog);
    saveDataToFile();

    res.status(201).json(newBlog);
  });
});

// update the specific data

router.put("/:id", async (req, res) => {
  cors(req, res, async () => {
    const { id } = req.params;
    const dataIndex = blogs.findIndex((item) => item.id === id);
    if (dataIndex === -1) {
      return res.status(404).json({ error: `${id} is not found` });
    }

    const { title, content, cover_image, description } = req.body;
    const updatedBlog = {
      id,
      title,
      content,
      cover_image,
      description,
    };
    blogs[dataIndex] = updatedBlog;
    saveDataToFile();

    return res.status(200).json(updatedBlog);
  });
});

// delete the specific data

router.delete("/:id", async (req, res) => {
  cors(req, res, async () => {
    const { id } = req.params;
    const dataIndex = blogs.findIndex((item) => item.id === id);
    if (dataIndex === -1) {
      return res.status(404).json({ error: `${id} is not found` });
    }

    blogs.splice(dataIndex, 1);

    saveDataToFile();

    return res
      .status(200)
      .json({ id: id, msg: `${id} was removed from the data source` });
  });
});

module.exports = router;
