import React from 'react';
import {Row, Col, Card} from 'react-bootstrap';

class SearchResults extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            flights: this.props.location.state.flights[0]
        }
    }

    addCards = () => {
        console.log(this.state.flights)
        const cards = this.state.flights.routes.map(item =>
            <Card>
                <Card.Body>
                    <Row>
                        <Card.Title style={{maginLeft: 50}}>{this.state.flights.origin + '-' + this.state.flights.destination}</Card.Title>
                        <Col><p style={{marginLeft: 100}}>{this.state.flights.fareClass}</p></Col>
                        <Col><p>{'Departure Time: ' + item.departureTime}</p></Col>
                        <Col><p>{'Arrival Time: ' + item.arrivalTime}</p></Col>
                        <Col><p>Starting FROM:</p></Col>
                        <Col><p>{'$' + item.priceUSD}</p></Col>
                    </Row>
                </Card.Body>
            </Card>
        )
        return cards
    }

    render() {
        return (
            <div style={{alignContent: "center"}}>
                <h2 style={{color: "#79bfda"}}>Search Results</h2>
                {this.addCards()}
            </div>
        )
    }
}

export default SearchResults