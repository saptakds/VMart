import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { BACKEND_URL, getDayName, getMonthName } from "../config/Config";
import renderHTML from "react-render-html";
import axios from "axios";
import Modal from "react-modal";

import deliveryTruck from "../../Assects/img/delivery-truck-icon.png";
import deliveryCharge from "../../Assects/img/delivery-charge-icon.png";
import easyReturn from "../../Assects/img/eay-exchange-icon.png";
import { Link, Redirect,useHistory } from "react-router-dom";

import Checkout from "./checkout/Checkout";



export default class ProductPage extends Component {
  
  constructor(props) {
    super(props);
   

    let ZIPCode = "";

    if (localStorage.getItem("user_pincode") != null) {
      ZIPCode = localStorage.getItem("user_pincode");
    }

    this.state = {
      name: decodeURI(this.props.match.params.pName),
      pID: this.props.match.params.pID,
      category: "",
      images: [],
      specs: [],
      price: "",
      sellPrice: "",
      offer: "",
      description: "",
      sellerID: "",
      sellerName: "",
      sizeChart: "",
      selectedSize: "",
      sizeButtonStyleS: "round_button_default",
      sizeButtonStyleM: "round_button_default",
      sizeButtonStyleL: "round_button_default",
      sizeButtonStyleXL: "round_button_default",
      promiseIsResolved: false,
      showSizeChart: false,
      isZIPDisabled: false,
      isZIPDisabledButton: "Check",
      deliveryText: "Delivery not possible",
      deliveryFee: "We do not deliver here",
      ZIPCode,
      redirect: false,
    };
    // const history = useHistory();
    this.getProductDetails = this.getProductDetails.bind(this);
    this.gallView = this.gallView.bind(this);
    this.specView = this.specView.bind(this);
    this.sellerView = this.sellerView.bind(this);
    this.handleSizeChartOpen = this.handleSizeChartOpen.bind(this);
    this.handleSizeChartClose = this.handleSizeChartClose.bind(this);
    this.handleSizeHover = this.handleSizeHover.bind(this);
    this.handleSizeOut = this.handleSizeOut.bind(this);
    this.handleSizeClick = this.handleSizeClick.bind(this);
    this.handleZIPSubmit = this.handleZIPSubmit.bind(this);
    this.handleZIPInput = this.handleZIPInput.bind(this);
    this.getLogisticsDetails = this.getLogisticsDetails.bind(this);
    this.responseLogisticsController = this.responseLogisticsController.bind(
      this
    );
    this.handleBuyNow=this.handleBuyNow.bind(this);
  }

  componentDidMount() {
    this.getProductDetails();
  }

  getProductDetails() {
    console.log(this.state.pID);
    console.log(this.state.name);
    if (!this.state.promiseIsResolved) {
      axios
        .post(BACKEND_URL + `/prod?prod_id=${this.state.pID}`)
        .then((response) => {
          this.responseController(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  handleZIPSubmit() {
    if (this.state.ZIPCode.length < 6 || this.state.ZIPCode==="") {
      console.log("Invalid ZIP Code");
    } else {
      localStorage.setItem("user_pincode", this.state.ZIPCode);
      if (this.state.isZIPDisabled) {
        this.setState({
          isZIPDisabled: false,
          isZIPDisabledButton: "Check",
        });
      } else {
        this.setState({
          isZIPDisabled: true,
          isZIPDisabledButton: "Change",
        });
      }
      this.getLogisticsDetails();
    }
  }

  getLogisticsDetails() {
    axios
      .post(
        BACKEND_URL +
          `/logistic_report?seller_id=${this.state.sellerID}&zip=${this.state.ZIPCode}`
      )
      .then((response) => {
        this.responseLogisticsController(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  responseLogisticsController(response) {
    if (response.status === 200) {
      if (
        (response.data.distanceInMetres !==
          "Unable to track truck route distance" &&
          response.data.durationInMinutes !==
            "Unable to track truck route duration") ||
        response.data.user_coordinates !==
          "Unable to retrieve coordinates from ZIP"
      ) {
        console.log(response.data);
        var currentTime = Math.floor(new Date().getTime()) + 259200000;
        var deliveryTime = new Date(
          currentTime + response.data.durationInMinutes * 60000
        );
        var displayDeliveryTime =
          "Get it by " +
          getDayName(deliveryTime.getDay()) +
          ", " +
          getMonthName(deliveryTime.getMonth()) +
          " " +
          deliveryTime.getDate();
          var displayDeliveryCharge="₹"+response.data.deliveryAmount+" delivery charge";
        this.setState({
          deliveryText:displayDeliveryTime,
          deliveryFee:displayDeliveryCharge,
        });
      }
    }
  }

  handleZIPInput(e) {
    if (e.target.value === "" || e.target.value.match(/^[0-9]+$/)) {
      this.setState({
        ZIPCode: e.target.value,
      });
    }
  }

  handleSizeChartOpen() {
    this.setState({
      showSizeChart: true,
    });
  }

  handleSizeChartClose() {
    this.setState({
      showSizeChart: false,
    });
  }

  handleSizeOut() {
    if (this.state.selectedSize === "") {
      this.setState({
        sizeButtonStyleS: "round_button_default",
        sizeButtonStyleM: "round_button_default",
        sizeButtonStyleL: "round_button_default",
        sizeButtonStyleXL: "round_button_default",
      });
    }
  }

  handleSizeHover(e) {
    e.preventDefault();
    if (this.state.selectedSize === "") {
      if (e.target.innerText === "S") {
        this.setState({
          sizeButtonStyleS: "round_button_hover",
          sizeButtonStyleM: "round_button_default",
          sizeButtonStyleL: "round_button_default",
          sizeButtonStyleXL: "round_button_default",
        });
      } else if (e.target.innerText === "M") {
        this.setState({
          sizeButtonStyleS: "round_button_default",
          sizeButtonStyleM: "round_button_hover",
          sizeButtonStyleL: "round_button_default",
          sizeButtonStyleXL: "round_button_default",
        });
      } else if (e.target.innerText === "L") {
        this.setState({
          sizeButtonStyleS: "round_button_default",
          sizeButtonStyleM: "round_button_default",
          sizeButtonStyleL: "round_button_hover",
          sizeButtonStyleXL: "round_button_default",
        });
      } else {
        this.setState({
          sizeButtonStyleS: "round_button_default",
          sizeButtonStyleM: "round_button_default",
          sizeButtonStyleL: "round_button_default",
          sizeButtonStyleXL: "round_button_hover",
        });
      }
    }
  }

  handleSizeClick(e) {
    e.preventDefault();
    this.setState({
      selectedSize: e.target.innerText,
    });
    if (e.target.innerText === "S") {
      this.setState({
        sizeButtonStyleS: "round_button_selected",
        sizeButtonStyleM: "round_button_default",
        sizeButtonStyleL: "round_button_default",
        sizeButtonStyleXL: "round_button_default",
      });
    } else if (e.target.innerText === "M") {
      this.setState({
        sizeButtonStyleS: "round_button_default",
        sizeButtonStyleM: "round_button_selected",
        sizeButtonStyleL: "round_button_default",
        sizeButtonStyleXL: "round_button_default",
      });
    } else if (e.target.innerText === "L") {
      this.setState({
        sizeButtonStyleS: "round_button_default",
        sizeButtonStyleM: "round_button_default",
        sizeButtonStyleL: "round_button_selected",
        sizeButtonStyleXL: "round_button_default",
      });
    } else {
      this.setState({
        sizeButtonStyleS: "round_button_default",
        sizeButtonStyleM: "round_button_default",
        sizeButtonStyleL: "round_button_default",
        sizeButtonStyleXL: "round_button_selected",
      });
    }
  }

  gallView() {
    var retView = "";
    for (var i = 0; i < this.state.images.length; i++) {
      // retView+=ReactDOMServer.renderToString(<Zoom img={this.state.images[i]} zoomScale={3} height={400} width={200} transitionTime={0.3}/>);
      retView +=
        '<img className="gall_image" src=' + this.state.images[i] + "></img>";
      if ((i + 1) % 2 === 0) {
        retView += "<br/>";
      }
    }
    return retView;
  }

  specView() {
    var retView = "";
    retView += "<table>" + "<tr>";
    for (var i = 0; i < this.state.specs.length; i++) {
      retView += "<td>";
      retView +=
        '<label className="textSpecHead">' +
        this.state.specs[i].split(":")[0].trim() +
        "</label><br/>";
      retView +=
        '<label className="textSpecBody">' +
        this.state.specs[i].split(":")[1].trim() +
        "</label><br/>";
      retView += "</td>";
      if ((i + 1) % 2 === 0) {
        retView += "</tr><tr>";
      }
    }
    retView += "</tr>";
    retView += "</table>";
    return retView;
  }

  sellerView() {
    var retView = "";
    retView += '<label className="textSpecParHead">Product Code: </label>';
    retView +=
      '<label className="textSpecBody">' + this.state.pID + "</label><br/>";
    retView += '<label className="textSpecParHead">Sold by: </label>';
    retView +=
      '<label className="textSpecBody">' +
      this.state.sellerName +
      "(verified)</label>";
    return retView;
  }

  responseController(response) {
    if (response.status === 200) {
      if (
        response.data.status === "error" &&
        response.data.message === "product_not_found"
      ) {
        console.log("product not found");
      } else if (
        response.data.status === "success" &&
        response.data.message === "product_found"
      ) {
        console.log(response.data);
        this.setState({
          category: response.data.category,
          price: response.data.price,
          sellPrice: Math.round(response.data.price * response.data.discount),
          offer: Math.round((1 - response.data.discount) * 100),
          description: response.data.description,
          sellerID: response.data.sellerID,
          sellerName: response.data.sellerName,
          sizeChart: response.data.sizeChart,
        });
        for (var i = 0; i < response.data.pictures.length; i++) {
          this.setState({
            images: [...this.state.images, response.data.pictures[i].url],
          });
        }
        for (var j = 0; j < response.data.specifications.length; j++) {
          this.setState({
            specs: [...this.state.specs, response.data.specifications[j].spec],
          });
        }
        this.setState({
          ...this.state,
          promiseIsResolved: true,
        });
        this.handleZIPSubmit();
      }
    }
  }

  handleBuyNow(e){
    alert("checkout")   
    this.setState({ redirect: true })
    window.open("/checkout","_blank")

    
  }

  render() {
    // if (this.state.redirect) {
    //   return <Redirect to="/checkout"/>
    // }

    if (!this.state.promiseIsResolved) {
      return null;
    } else {
      return (
        <div className="ProductPage">
          <Helmet>
            <title>Buy {this.state.name} | VMart</title>
          </Helmet>
          <br />
          <br />
          <Modal
            className="sizeChartModal"
            isOpen={this.state.showSizeChart}
            onRequestClose={this.handleSizeChartClose}
            shouldCloseOnOverlayClick={true}
          >
            <img src={this.state.sizeChart} alt="sizeChart" />
          </Modal>
          <label className="blackHeadlbl">
            {this.state.category} {">"} {this.state.name}
          </label>
          <br />
          <br />
          <div className="img_grid">{renderHTML(this.gallView())}</div>
          <div className="prod_details">
            <label className="blackHeadlbl">{this.state.name}</label>
            <br />
            <label className="textgreyH1">{this.state.description}</label>
            <br />
            <br />
            <label className="blackHeadlbl">₹ {this.state.sellPrice}</label>
            <label className="textgreyH1_strikethrough">
              ₹ {this.state.price}
            </label>
            <label className="textofferBig">({this.state.offer}% OFF)</label>
            <br />
            <label className="textTaxesSmall">inclusive of all taxes</label>
            <br />
            <br />
            <label className="textSpecBody">SELECT SIZE</label>
            <label className="textofferMed" onClick={this.handleSizeChartOpen}>
              SIZE CHART {">"}
            </label>
            <br />
            <br />
            <button
              className={this.state.sizeButtonStyleS}
              onMouseOver={this.handleSizeHover}
              onMouseOut={this.handleSizeOut}
              onClick={this.handleSizeClick}
            >
              S
            </button>
            <button
              className={this.state.sizeButtonStyleM}
              onMouseOver={this.handleSizeHover}
              onMouseOut={this.handleSizeOut}
              onClick={this.handleSizeClick}
            >
              M
            </button>
            <button
              className={this.state.sizeButtonStyleL}
              onMouseOver={this.handleSizeHover}
              onMouseOut={this.handleSizeOut}
              onClick={this.handleSizeClick}
            >
              L
            </button>
            <button
              className={this.state.sizeButtonStyleXL}
              onMouseOver={this.handleSizeHover}
              onMouseOut={this.handleSizeOut}
              onClick={this.handleSizeClick}
            >
              XL
            </button>
            <br />
            <br />
            <button className="mediumCartButton">ADD TO CART</button>
            <br />
            <button className="mediumCartButton" onClick={this.handleBuyNow}>
              BUY NOW
            </button>
            <br />
            <hr />
            <br />
            <label className="blackH1lbl">DELIVERY OPTIONS</label>
            <br />
            <br />
            <form className="pincodeChecker">
              <input
                className="edPincode"
                type="text"
                maxLength="6"
                name="zip"
                id="zip"
                placeholder="Enter pincode"
                disabled={this.state.isZIPDisabled}
                onChange={this.handleZIPInput}
                value={this.state.ZIPCode}
              />
              <label className="textofferMed" onClick={this.handleZIPSubmit}>
                {this.state.isZIPDisabledButton}
              </label>
            </form>
            <br />
            <br />
            <div className="deliveryContainer">
              <img
                className="deliveryIcons"
                src={deliveryTruck}
                alt="deliveryTruck"
              />
              <label className="textSpecBody">{this.state.deliveryText}</label>
              <br />
              <br />
              <img
                className="deliveryIcons"
                src={deliveryCharge}
                alt="deliveryCharge"
              />
              <label className="textSpecBody">{this.state.deliveryFee}</label>
              <br />
              <br />
              <img
                className="deliveryIcons"
                src={easyReturn}
                alt="easyReturn"
              />
              <label className="textSpecBody">
                Easy 30 days return & exchange available
              </label>
            </div>
            <hr />
            <br/>

            {/* <button className="mediumCartButton" onClick={this.handleBuyNow}>BUY NOW</button>
           
            <hr/> */}
            <br />
            <label className="blackH1lbl">Specifications</label>
            <br />
            {renderHTML(this.specView())}
            <br />
            <hr />
            <br />
            {renderHTML(this.sellerView())}
            <br />
            <br />
          </div>
        </div>
      );
    }
  }
}
