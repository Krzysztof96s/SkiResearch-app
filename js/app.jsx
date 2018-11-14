import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink,
} from 'react-router-dom';
import './../sass/style.scss';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import geolib from 'geolib'



export class MapContainer extends Component {

    state = {defaultLocation: {lat:52.15, lng:21.00}, loading: true ,
            newLocation: {lat:0.0, lng:0.0}};


    componentDidMount(props) {
        navigator.geolocation.getCurrentPosition(
         position => {
             const {latitude, longitude} = position.coords;

             this.setState({
                 userLocation: { lat: latitude, lng: longitude },
                 loading: false
             });
         },
            () => {
                this.setState({ loading: false });
            }
        );

    }


    render() {
        const { loading, userLocation } = this.state;
        const { google } = this.props;
        const style = {
            width: '100%',
            height: '100%',
        }

        if (loading) {
            return null;
        }
        console.log(this.props);
        return  <Map style={style} google={google} initialCenter={userLocation} zoom={7}>
                    <Marker onClick={this.onMarkerClick}
                            name={'Current location'} />
                {this.props.skiResorts.map(resort => <Marker position={resort.georeferencing}></Marker>)}
                    <Marker/>
                    <InfoWindow onClose={this.onInfoWindowClose}>
                        <div>
                            <h1>nagłówek</h1>
                        </div>
                    </InfoWindow>
                </Map>


    }
}

const GoogleMap = GoogleApiWrapper({
    apiKey: ("AIzaSyBCngwXUiffT280txuSBsKBCOFpmAdVqN4")
})(MapContainer)


class Header extends React.Component{
    render(){
        return (

                <header className='header'>
                    <div className='content'>
                        <h1>Wyszukiwarka ośrodków narciarskich</h1>
                    </div>
                </header>

        )
    }
}

class UserPanel extends React.Component{
    state = {
        skiResorts: [],
        value:'Beg'
    }

    componentDidMount(props) {

        fetch('http://localhost:3000/ski-centers').then(resp =>{
            if (resp.ok){
                return resp.json();

            }

            throw new Error('błąd')
        })
            .then(data =>{
                console.log(data)
                this.setState({
                    skiResorts: data
                })
            })

    }


    change=(event) =>{
        this.setState({value: event.value});
    }

    render() {
        /*const spots = this.props.skiResorts.map(resort => <div>{resort.georeferencing}</div>);

        console.log(geolib.findNearest(this.state.userLocation, this.props.skiResorts, 1))
        console.log(geolib.convertUnit('km', 14213, 2)) // -> 14,21*/

        return (

               /* <select onChange={this.change} value={this.state.value}>
                    <option value='Beg' onChange={this.change}>Początkujący</option>
                    <option value='Adv' onChange={this.change}>Średniozaawansowany</option>
                    <option value='Pro' onChange={this.change}>Profesfonalny</option>
                </select>*/


                <div className='section'>
                    <form>
                        <div>
                            <button onClick={this.handleBeg}>Początkujący</button>
                            <button onClick={this.handleAdv}>Średnio-zaawansowany</button>
                            <button onClick={this.handlePro}>Profesjonalista</button>

                            <input type='submit' value='szukaj!'></input>
                        </div>
                        <label>
                            Pokaż najbliższy ośrodek
                            <input type="submit" value="szukaj"/>
                        </label>
                        <label>
                            Pokaż odległość od wybranego ośrodka
                            <input type="submit" value="szukaj"/>
                        </label>
                        <label>
                            Pokaż średnią prędkość podróży do wybranego ośrodka
                            <input type="submit" value="szukaj"/>
                        </label>
                        <div className='map'>
                            <GoogleMap skiResorts={this.state.skiResorts}/>
                        </div>
                    </form>
            </div>
        )
    }
}


class App extends React.Component{
    render() {
        return(
        <div>
            <Header/>
            <UserPanel/>
        </div>
        )
}
        /*<HashRouter>
            <div>
                <Route path="/" component={ Main } />
                <Route path="/test" component={ Test } />
            </div>
        </HashRouter>
*/

}
document.addEventListener('DOMContentLoaded', function(){
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    )
})