import React, { Component } from "react";
import { Redirect } from "react-router";
import Axios from "axios";
import axios from "axios";
import { setcart, setproductimages } from "../Actions";
import { connect } from "react-redux";
import slides from "./Carousel";
import getcart from "../Reducers/Requestdata/getcart";
class DienthoaiDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
    };
  }
  format2 = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  addCartdetail = () => {
    const id = this.props.location.state.id;
    const user_login_infor = JSON.parse(
      localStorage.getItem("user_login_infor")
    );
    const user_login = JSON.parse(localStorage.getItem("user_login"));
    if (user_login_infor && this.state.product !== null && user_login_infor) {
      let producid = this.state.product.id;
      let accountId = user_login_infor.id;
      Axios.post(
        "http://localhost:8080/api/v4/cartdetail?productId=" +
          producid +
          "&accountId=" +
          accountId
      ).then((response) => {
        console.log(response);
        getcart(accountId).then((response) =>
          this.props.setcart(response.data)
        );
      });
    }
  };
  componentDidMount() {
    const id = this.props.location.state.id;
    Axios.get("http://localhost:8080/api/v2/products/" + id)
      .then((response) => {
        console.log(response);
        this.setState({
          product: response.data,
        });
      })
      .then(() => {
        Axios.get(
          "http://localhost:8080/api/v2/products/" + id + "/images"
        ).then((response) => {
          console.log(response.data);
          this.props.setproductimages(response.data);
        });
      });
  }
  render() {
    console.log(this.props.images);
    let slideshow;
    if (this.props.images) {
      slideshow = slides(this.props.images, "800px");
      console.log(slideshow);
    } else {
      slideshow = "";
    }
    let pr = this.state.product;
    let row;
    let prname;
    if (pr !== null) {
      prname = (
        <div style={{ marginLeft: "20px" }}>
          <h1>
            ??i???n tho???i {pr.name} {pr.memory}
          </h1>
        </div>
      );
      row = [
        <div
          style={{
            marginLeft: "30px",
            backgroundColor: "white",
            width: "350px",
            float: "left",
          }}
        >
          <h3>Th??ng tin chi ti???t s???n ph???m :</h3>
          <p style={{ fontSize: "20px" }}>Dung l?????ng Ram : {pr.ram}</p>
          <p style={{ fontSize: "20px" }}>B??? nh??? trong : {pr.memory}</p>
          <p style={{ fontSize: "20px" }}>H??ng s???n xu???t : {pr.brand}</p>
          {/* <p>
            <span
              style={{
                textDecoration: "line-through",
                paddingRight: "5px",
              }}
            >
              {this.format2(pr.price)} ??{" "}
            </span>

            <span> -{pr.discount}%</span>
          </p> */}
          {/* <p style={{ textAlign: "center", fontSize: "larger" }}>
            {this.format2(
              Number(pr.price) - (Number(pr.price) * Number(pr.discount)) / 100
            )}{" "}
            ??
          </p> */}
          <h4>c??n l???i : {pr.quantity}</h4>
          <p style={{ fontSize: "25px" }}>
            Gi?? khuy???n m??i :{" "}
            {this.format2(
              Number(pr.price) - (Number(pr.price) * Number(pr.discount)) / 100
            )}{" "}
            ??
          </p>
          <button type="button" class="btn btn-warning">
            Mua ngay
          </button>
          <button
            onClick={this.addCartdetail}
            type="button"
            class="btn btn-success"
          >
            Th??m v??o gi??? h??ng
          </button>
        </div>,
      ];
    }
    return (
      <div>
        {prname}
        {slideshow}
        {row}
        <hr style={{ clear: "both" }} />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    images: state.productreducer.images,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setproductimages: (images) => {
      dispatch(setproductimages(images));
    },
    setcart: (cart) => {
      dispatch(setcart(cart));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DienthoaiDetail);
