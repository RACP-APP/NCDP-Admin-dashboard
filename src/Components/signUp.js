import React from 'react';
import '../css/component.css';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="container ">
        <div class="row">
          <div className="Centrlize">
            <div class="card ">
              <div class="card-body">
                <h5 class="card-title">SignUp to NCDP Admin dashboard</h5>

                <form>
                  <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">
                      User Name:
                    </label>
                    <br></br>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        readonly
                        class="form-control"
                        id="staticEmail"
                        placeholder="Insert Your User Name Here.."
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">
                      Email :
                    </label>
                    <br></br>
                    <div class="col-sm-10">
                      <input
                        type="text"
                        readonly
                        class="form-control"
                        id="staticEmail"
                        value="email@example.com"
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputPassword" class="col-sm-2 col-form-label">
                      Password :
                    </label>
                    <div class="col-sm-10">
                      <input
                        type="password"
                        class="form-control"
                        id="inputPassword"
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    class="btn btn-primary btn-lg btn-block"
                  >
                    SignUp to NCDP
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
