// Inspired by Corey Haggards "Screeners"
// https://dribbble.com/shots/4138489-Screeners

import React, { Fragment } from "react";
import { Parallax, ParallaxLayer } from "react-spring";

const MainPage = ({ offset, caption, first, second, gradient, onClick }) => (
    <Fragment>
        <ParallaxLayer offset={offset} speed={0.2} onClick={onClick}>
            <div className="slopeBegin" />
        </ParallaxLayer>

        <ParallaxLayer offset={offset} speed={-0.2} onClick={onClick}>
            <div className={`slopeEnd ${gradient}`} />
        </ParallaxLayer>

        <ParallaxLayer className="text number" offset={offset} speed={0.3}>
            <span>0{offset + 1}</span>
        </ParallaxLayer>

        <ParallaxLayer className="text header" offset={offset} speed={0.4}>
            <span>
                <p style={{ fontSize: 20 }}>{caption}</p>
                <div className={`stripe ${gradient}`} />
                <p>{first}</p>
                <p>{second}</p>
            </span>
        </ParallaxLayer>
    </Fragment>
)

export default class MainSlider extends React.Component {
    state = {
        currentPage: 0
    };

    setPage = index => {
        if (index < 0) {
            index = 2;
        } else if (index > 2) {
            index = 0;
        }

        this.setState({ currentPage: index });
        this.parallax.scrollTo(index);
    }

    componentDidMount() {
        document.addEventListener("keydown", event => {
            console.log(event);

            if (event.keyCode === 37) {
                this.setPage(this.state.currentPage - 1);
            } else if (event.keyCode === 39) {
                this.setPage(this.state.currentPage + 1);
            } else if (event.keyCode === 40) {

            }
        })
    }

    render() {
        return (
            <Parallax className="container" ref={e => this.parallax = e} pages={3} horizontal scrolling={false}>
                <Page offset={0} gradient="pink" caption="Page 1" first="Header" second="Subheader" onClick={() => this.setPage(1)} />
                <Page offset={1} gradient="teal" caption="Page 2" first="Header" second="Subheader" onClick={() => this.setPage(2)} />
                <Page offset={2} gradient="tomato" caption="Page 2" first="Header" second="Subheader" onClick={() => this.setPage(0)} />
            </Parallax>
        )
    }
}