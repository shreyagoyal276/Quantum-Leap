import React, { useEffect, useState } from "react";
import Navbar from './Navbar';
import '../styles/NewsSection.css';


const NewsSection = () => {
  const [news, setNews] = useState([]);

  const fetchSavedNews = () => {
    console.log("Fetching News");
    fetch("http://localhost:8000/saved-news")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched News:", data); // 🔍 Log to browser console
        setNews(data);
      })
      .catch((err) => console.error("Error fetching saved news:", err));
  };

  const fetchNewNews = () => {
    fetch("http://localhost:8000/realtime-news")
      .then(() => {
        // After fetching real-time news, reload saved news
        fetchSavedNews();
      })
      .catch((err) => console.error("Error fetching new news:", err));
  };

  useEffect(() => {
    fetchSavedNews(); // Load saved news initially
  }, []);

  return (
    <div  className="news-wrapper">
      <Navbar />
    <div className="news-container" style={{ padding: "20px" }}>
      <h2 className="news-title">NEWS</h2>
      {/* style={{ marginBottom: "20px", padding: "10px 15px" ,color: "green"}} */}
      <button onClick={fetchNewNews} className="refresh-item-btn">
        Click here to Fetch Latest News
      </button>

      {news.length === 0 ? (
        <p>No saved news found.</p>
      ) : (
        news.map((article, index) => (
          <div
            key={index}
            className="news-form"
          >
            {/* border: 2px solid #ffaad4;
            background-color: #fff8fc; */}
            <h3 style={{fontStyle:"BOLD"}}>{article.title} </h3>
            <p  style={{color:"gray"}}>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" style={{color:"magenta"}}>
              Read more
            </a>
            <p>
              <em>{new Date(article.publishedAt).toLocaleString()}</em>
            </p>
          </div>
        ))
      )}
      </div>
    </div>
  );
};

export default NewsSection;
