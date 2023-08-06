import React from "react";

const Footer = () => {
  return (
    <div>
      <footer class="footer p-10  mt-5" style={{ background: "#271033" }}>
        <div>
          <label tabindex="0" className="btn btn-ghost btn-circle avatar">
            <div className="w-50 rounded-full">
              <img src="images/vrnlogonew.png" alt="VRNITSOLUTION LOGO" />
            </div>
          </label>
          <p className="text-white">
            VRNITSOLUTION
            <br />
            Providing reliable tech since 2023
          </p>
        </div>
        <div>
          <span class="footer-title" style={{ color: "#E03616" }}>
            Company
          </span>
          <a class="link link-hover text-white">About us</a>
          <a class="link link-hover text-white">Contact</a>
          <a class="link link-hover text-white">Jobs</a>
          <a class="link link-hover text-white">Press kit</a>
        </div>
        <div>
          <span class="footer-title" style={{ color: "#E03616" }}>
            Legal
          </span>
          <a class="link link-hover text-white">Terms of use</a>
          <a class="link link-hover text-white">Privacy policy</a>
          <a class="link link-hover text-white">Cookie policy</a>
        </div>
        <div>
          <span className="footer-title" style={{ color: "#E03616" }}>
            Newsletter
          </span>
          <div className="form-control w-80">
            <label className="label">
              <span className="label-text text-white">
                Enter your email address
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="username@site.com"
                className="input input-bordered w-full pr-16"
              />
              <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
