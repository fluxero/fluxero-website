import React from 'react';
import { Hero }               from './components/Hero';
import { LiveCurtailmentBar } from './components/LiveCurtailmentBar';
import { Ticker }             from './components/Ticker';
import { Partners }           from './components/Partners';
import { Problem }       from './components/Problem';
import { CurtailmentMap } from './components/CurtailmentMap';
import { WastedEnergy }  from './components/WastedEnergy';
import { Solution }      from './components/Solution';
import { Technology }    from './components/Technology';
import { Traction }      from './components/Traction';
import { BusinessModel } from './components/BusinessModel';
import { Roadmap }       from './components/Roadmap';
import { Team }          from './components/Team';
import { FAQ }           from './components/FAQ';
import { Contact }       from './components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <LiveCurtailmentBar />
      <Ticker />
      <Partners />
      <Problem />
      <CurtailmentMap />
      <WastedEnergy />
      <Solution />
      <Technology />
      <Traction />
      <BusinessModel />
      <Roadmap />
      <Team />
      <FAQ />
      <Contact />
    </>
  );
}
