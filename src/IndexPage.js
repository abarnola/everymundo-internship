import React from 'react';
import './IndexPage.css';
import {Carousel, Modal, Button, Row, Col, Form} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
const axios = require('axios');

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleModalClose = this.handleModalClose.bind(this);
        //Save currently selected flight information in state
        this.state = {
            popFlights: [],
            showModal: false,
            formValidated: false,
            destination: '',
            origin: '',
            departureDate: '',
            returnDate: '',
            tripType: '',
            passengerCount: 1,
            promoCode: '',
            searchResults: [],
            searchValidated: false,
            tripTypes: {'oneWay': 'One Way', 'roundTrip': 'Round Trip'}
        }
    }

    //Axios GET request for popular flights. Stores result in state.popFlights
    getPopularFlights = () => {
        axios.get('https://everymundointernship.herokuapp.com/popularRoutes/CI64IM13NX93')
        .then(res => {
            this.setState({
                popFlights: res.data
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    //Add items to the Carousel. uses map(). For future references, use map(item, i) and return <Element key=i />
    //to avoid the "array elements need a key" error
    addCarouselItems = () => {
        const items = this.state.popFlights.map(item => 
            <Carousel.Item flight={item}>
                <img src={item.routeCoverImage} alt="RouteCoverImage" width='800' height='450'  />
                <Carousel.Caption>
                    {/* Organize the caption in a 2x2 grid of rows and cols for readability, and to display all specified data */}
                <Row>
                    <Col>
                        <h1 style={{textShadow: '1px 1px 2px black'}}>{item.origin + "-" + item.destination}</h1>
                    </Col>
                    <Col>
                        <Row>
                            <h3 style={{marginLeft: 30, marginTop: 10, textShadow: '1px 1px 2px black'}}>Starting From:</h3>
                            <h2 style={{marginLeft: 20, marginTop: 8, textShadow: '1px 1px 2px black'}}>{'$' + item.priceUSD}</h2>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h3 style={{textShadow: '1px 1px 2px black'}}>{this.state.tripTypes[item.tripType]}</h3>
                    </Col>
                    <Col>
                    {/*On click of the View Deal button, store this popular flight's info in state, and show the Modal*/}
                    <Button variant="primary" 
                        onClick={() => {
                            this.setState ({
                                showModal: true,
                                destination: item.destination,
                                origin: item.origin,
                                departureDate: this.formatDate(item.departureDate),
                                returnDate: this.formatDate(item.returnDate),
                                tripType: item.tripType,
                            })
                        }}>
                        View Deal
                        </Button>
                    </Col>
                </Row>
                </Carousel.Caption>
            </Carousel.Item>
        )
        return items;
    }

    //Do the get request before render() so that the data is already there when we 
    componentWillMount() {
        this.getPopularFlights();
    }

    handleModalClose = () => {
        this.setState({ showModal: false });
    }

    handleChange = (event) => {
        var name = event.target.name;
        var value = event.target.value;

        this.setState({[name]: value})
    }

    formatDate = (date) => {
        const d = date.split("/");
        if (d.length > 1) {
            if (d[0].length === 1)
                d[0] = "0" + d[0];
        }
        
        
        return (d[2] + "-" + d[0] + "-" + d[1]);
    }

    //Handles search using the already updated state values
    handleSearch = () => {
        if (this.state.passengerCount >= 1 && this.state.origin && 
            this.state.destination && ((this.state.returnDate && this.state.tripType === 'roundTrip') || this.state.tripType === 'oneWay')
             && this.state.departureDate) {
            axios({
                method: 'post',
                url: 'https://everymundointernship.herokuapp.com/search/CI64IM13NX93',
                data: {
                    destination: this.state.destination,
                    origin: this.state.origin,
                    returnDate: this.state.returnDate,
                    departureDate: this.state.departureDate,
                    passengerCount: this.state.passengerCount,
                    promoCode: this.state.promoCode
                }
            })
            .then((res) => {
                this.setState({searchResults: res.data, showModal: false, searchValidated: true},
                () => {
                this.render()
                })
            })
            .catch((err) => {
                console.log(err);
            });
        }   
    }

    render() {
        //Redirect to /SearchResults passing the server's response, if search was validated
        if (this.state.searchValidated) {
            console.log(this.state.searchResults)
            return <Redirect to={{
                pathname: '/SearchResults',
                state: {flights: this.state.searchResults}
            }} push />
        }
        return (
            //Attempted to make div 100% of visible height. 
            <div style={{minHeight: '100vh'}}>  
                {/* react-bootstrap carousel to display the popular flights received from the API. Populated by addCarouselItems()
                    above */}
                <Carousel>
                    {this.addCarouselItems(this.state.popflights)}
                </Carousel>

                {/* Modal that shows if this.state.showModal. Organized in two Cols of three Rows each. Doesn't have an
                    onSubmit, that's handled by the Search Flights button*/}
                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Flight Search</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Form.Label as="legend" row style={{marginLeft: 20}}>Trip Type: </Form.Label>
                                <Form.Check 
                                    style={{marginLeft: 20}}
                                    type="radio" 
                                    label="Round Trip" 
                                    checked={this.state.tripType === "roundTrip"} 
                                    onChange = {() => this.setState({tripType: "roundTrip"})} 
                                />
                                <Form.Check
                                    style={{marginLeft: 20}}
                                    type="radio"
                                    label="One-Way"
                                    checked={this.state.tripType === "oneWay"}
                                    onChange = {() => this.setState({tripType: "oneWay"})}
                                />
                                </Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId={"formgridOrigin"}>
                                    <Form.Label>Origin*</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        name="origin"
                                        value={this.state.origin}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Label>Depart*</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="departureDate"
                                        value={this.state.departureDate}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Label>Passengers</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="20"
                                        name="passengerCount"
                                        value={this.state.passengerCount}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Destination</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="destination"
                                        value={this.state.destination}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Label>Return*</Form.Label>
                                    <Form.Control
                                        disabled={this.state.tripType === 'oneWay'}
                                        type="date"
                                        name="returnDate"
                                        value={this.state.returnDate}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Label>Promo Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="promoCode"
                                        value=""
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleModalClose}>Close</Button>
                        <Button variant="primary" onClick={this.handleSearch}>Search Flights</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default IndexPage;