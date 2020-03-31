import React from 'react';
import $ from 'jquery';
import config from '../config';

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className=" footer shawBackground borderTop">
        <div className="row"></div>
        <div className="row">
          <a class="socialicons" type="button" role="button">
            <i class="fab fa-facebook-f"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-twitter"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-google-plus-g"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-linkedin-in"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-instagram"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-pinterest"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-vk"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-stack-overflow"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-youtube"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-slack-hash"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-github"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-dribbble"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-reddit-alien"></i>
          </a>

          <a class="socialicons" type="button" role="button">
            <i class="fab fa-whatsapp"></i>
          </a>
        </div>
        <div className="row">© 2020 | About | Contact</div>
      </div>
    );
  }
}

export default Footer;
