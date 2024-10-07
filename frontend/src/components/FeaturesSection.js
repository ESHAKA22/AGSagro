import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FeaturesSection.css';
import ChatBox from './ChatBox';
import { FaHeadset, FaCreditCard, FaBullhorn, FaCalculator, FaTruck, FaStopwatch } from 'react-icons/fa'; // Icons for the categories

import communicatiionImg from '../assets/images/communication.jpg';
import feedbackImg from '../assets/images/feedback.png';
import newsImg from '../assets/images/news.png';
import serviceImg from '../assets/images/image.jpg'; // Ensure the path is correct

const features = [
  {
    title: "Communications",
    image: communicatiionImg,
    description: "Communicate with us easily",
    link: "/add-ticket"
  },
  {
    title: "Feedback",
    image: feedbackImg,
    description: "Give us your valuable feedback",
    link: "/add-feedback"
  },
  {
    title: "Company News",
    image: newsImg,
    description: "Stay updated with company news",
    link: "/news"
  }
];

// New featured categories array
const categories = [
  {
    title: "Customer Support",
    icon: <FaHeadset />,
    link: "/customer-support"
  },
  {
    title: "Payments & Security",
    icon: <FaCreditCard />,
    link: "/payments-security"
  },
  {
    title: "Marketing",
    icon: <FaBullhorn />,
    link: "/marketing"
  },
  {
    title: "Accounting & Finance",
    icon: <FaCalculator />,
    link: "/accounting-finance"
  },
  {
    title: "Shipping & Fulfillment",
    icon: <FaTruck />,
    link: "/shipping-fulfillment"
  },
  {
    title: "Site Optimization",
    icon: <FaStopwatch />,
    link: "/site-optimization"
  }
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      

      {/* Customer Service Section with Additional Text */}
      <div className="customer-service-section">
        <img src={serviceImg} alt="Customer Service" className="service-img" />
        <div className="customer-service-content">
          <h3>Customer Service</h3>
          <p>
            At our company, we are committed to providing excellent customer service and ensuring your satisfaction. 
            Whether you have questions, need assistance, or want to provide feedback, our team is here to support you. 
            Our customer service representatives are available 24/7 to address your concerns and provide timely solutions.
          </p>
          <p>
            Click the button below to learn more about our services and get the help you need.
          </p>
          <Link to="/customer-service" className="learn-more-btn">Learn More</Link>
        </div>
      </div>

      {/* Introduction to the Features Section */}
      <div className="feature-cards">
        {features.map((feature, index) => (
          <div key={index} className="card">
            <img src={feature.image} alt={feature.title} className="card-img" />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <Link to={feature.link} className="see-more-btn">See More</Link>
          </div>
        ))}
      </div>

      {/* New Featured Categories Section */}
      <div className="categories-section">
        <h3>Featured Categories</h3>
        <div className="category-cards">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h4>{category.title}</h4>
              
            </div>
          ))}
        </div>
      </div>
      
      <ChatBox />
    </section>
  );
}

export default FeaturesSection;
