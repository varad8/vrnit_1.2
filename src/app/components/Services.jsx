import React from "react";
import "./servicesection.css";
const Services = () => {
  return (
    <div className="container px-4 mx-auto mt-2">
      <h3 className="mt-5 text-start font-bold text-3xl josefin" id="services">
        Services
      </h3>
      <section className="services mt-2">
        <div className="service-card">
          <div className="service-icon">
            <img src={"/images/coding.png"} className="icon" alt="Web Design" />
          </div>
          <h3>Web Design</h3>
          <p className="worksans">
            Web design is the process of creating visually appealing and
            user-friendly websites, but it's also important to consider SEO
            (Search Engine Optimization) during the design process. Keywords
            play a crucial role in SEO, so its easy to get highly and organic
            traffic on your website.{" "}
          </p>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <img
              src={"/images/mobileapp.png"}
              className="icon"
              alt="App Development"
            />
          </div>
          <h3>App Development</h3>
          <p className="worksans">
            Mobile apps are essential for businesses because they provide a
            convenient way for customers to interact with the brand. Apps can
            increase customer engagement, loyalty, arevenue easy access Overall,
            mobile apps are a crucial tool for businesses to stay competitive in
            today's digital landscape.{" "}
          </p>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <img
              src={"/images/creativity.png"}
              className="icon"
              alt="Graphics Design"
            />
          </div>
          <h3>Graphics Design</h3>
          <p className="worksans">
            Graphic design involves the use of typography, images, colors, and
            layout to create designs that can be used for various purposes, such
            as branding, advertising, and marketing.{" "}
          </p>
        </div>

        <div className="service-card">
          <div className="service-icon">
            <img
              src={"/images/advertising.png"}
              className="icon"
              alt="Digital Marketing"
            />
          </div>
          <h3>Digital Marketing</h3>
          <p className="worksans">
            Digital marketing is the practice of promoting products or services
            using digital channels, such as search engines, social media, email,
            and websites. It involves various strategies and techniques to reach
            and engage with target audiences online.{" "}
          </p>
        </div>

        <div className="service-card">
          <div className="service-icon">
            <img
              src={"/images/growth.png"}
              className="icon"
              alt="Google Business"
            />
          </div>
          <h3>Google Business</h3>
          <p className="worksans">
            GMB tool offered by Google that allows businesses to manage their
            online presence across Google's search engine and other platforms.
            It helps businesses to display important information.{" "}
          </p>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <img
              src={"/images/money.png"}
              className="icon"
              alt="Loan Service"
            />
          </div>
          <h3>Financial Boost</h3>
          <p className="worksans">
            In the Finance Boost We Provide Loan Service from DSA Partner.That
            Loans can be used for various purposes such as purchasing a home,
            starting a business, or financing a major purchase.{" "}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Services;
