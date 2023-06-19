"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import level from "../public/level.json";
import dailyactivity from "../public/daily_act.json";
import tprefill from "../public/tp_refill.json";

export default function Home() {
    const [currentlevel, setcurrentlevel] = useState('');
    const [goallevel, setgoallevel] = useState('');
    const [isdailytrainingchecked, setisdailytrainingchecked] = useState(false);
    const [istprefillchecked, setistprefillchecked] = useState(false);
    const [selectedtprefill, setselectedtprefill] = useState(0);
    const [usedtprefill, setusedtprefill] = useState(0);
    const [exp, setexp] = useState('');
    const [tp, settp] = useState('');
    const [fuelused, setfuelused] = useState('');
    const [isweeklyimmersifierchecked, setisweeklyimmersifierchecked] = useState(false);

    const handleWeeklyImmersifierChange = (event) => {
        setisweeklyimmersifierchecked(event.target.checked);
    };

    const getWeeklyImmersifierValue = () => {
        return isweeklyimmersifierchecked ? "4" : "0";
      };
    
    const handleCurrentExpChange = (event) => {
      setexp(Number(event.target.value));
    };

    const handleTp = (event) => {
        settp(Number(event.target.value));
      };
    
    const handlefuelusedChange = (event) => {
      setfuelused(event.target.value);
    };
    
    const handletprefillChange = (event) => {
       setistprefillchecked(event.target.checked);
    };

    const handleselectedtprefillChange = (event) => {
        setselectedtprefill(Number(event.target.value));
        const selectedKey = event.target.options[event.target.selectedIndex].text;
        setusedtprefill(selectedKey);
    };
      

    const handlecurrentlevelChange = (event) => {
      setcurrentlevel(event.target.value);
    };
  
    const handlegoallevelChange = (event) => {
      setgoallevel(event.target.value);
    };
  
    const handleDailyTrainingChange = (event) => {
      setisdailytrainingchecked(event.target.checked);
    };
  
    const calculateEqLevel = (level) => {
        if (level >= 1 && level <= 19) {
          return 0;
        } else if (level >= 20 && level <= 29) {
          return 1;
        } else if (level >= 30 && level <= 39) {
          return 2;
        } else if (level >= 40 && level <= 49) {
          return 2;
        } else if (level >= 50 && level <= 59) {
          return 4;
        } else if (level >= 60 && level <= 65) {
          return 5;
        } else if (level >= 66 && level <= 70) {
          return 6;
        }
    };
      
    const calculateExpNeeded = () => {
        const currentExp = level[currentlevel];
        const goalExp = level[goallevel];
      
        if (currentExp !== undefined && goalExp !== undefined) {
          let expNeeded = goalExp - currentExp - exp;
          return expNeeded > 0 ? expNeeded : 0;
        }
        return 0;
    };

    const calculateDayNeeded = () => {
        const expNeeded = calculateExpNeeded();
        const immersifier = parseInt(getWeeklyImmersifierValue());
        let dayNeeded = 1+((expNeeded)-(fuelused*60/10*50))/((tp/10*50)+(usedtprefill*60/10*50)+(immersifier*40/10*50/7));
        if (isdailytrainingchecked) {
          const eq_exp = calculateEqLevel(currentlevel); // Calculate eq_exp based on currentlevel
          const dailyExp = dailyactivity[eq_exp] || 0;
          let dailyxp = dailyExp*5;
          dayNeeded = 1+((expNeeded)-(fuelused*60/10*50))/((tp/10*50)+dailyxp+(usedtprefill*60/10*50)+(immersifier*40/10*50/7));
        }
        return isNaN(dayNeeded) || !isFinite(dayNeeded) ? 0 : Math.ceil(dayNeeded);
    }

    const yesorno = isdailytrainingchecked ? "Yes" : "No";
    const refillyesorno = istprefillchecked ? "Yes" : "No";

  return (
    <section className="w-full px-6 pb-12 antialiased bg-white tails-selected-element" data-tails-scripts="//unpkg.com/alpinejs">
      <div className="mx-auto max-w-7xl">
        <div className="container max-w-lg px-4 mb-8 py-32 mt-px text-left md:max-w-none md:text-center">
          <div className='flex justify-center mb-4'>
            <img src='/pompom.webp' alt='pom-pom' width={200} className='align-items-center'/>
          </div>
          <h1 className="text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl">
            <span className="inline md:block">Trailblaze</span>
            <span className="relative mt-2 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-500 md:inline-block">
              Simple Calculator
            </span>
          </h1>
          <div className="mx-auto mt-5 text-gray-500 md:mt-12 md:max-w-lg md:text-center lg:text-lg">
            Calculating the required trailblaze exp and estimating days needed from given information.
          </div>
        </div>
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="bg-white border-t border-gray-200 shadow-2xl p-4 rounded-lg">
              <fieldset className='p-4'>
                <legend className='text-md text-center font-semibold leading-6 text-gray-900'>Level-EXP</legend>
                <div className="space-y-6 border-t border-gray-200">
                  <div className="relative block gap-x-3 col-span-full mt-4">
                    <label htmlFor="fuelused" className='block text-sm font-medium leading-6 text-gray-900'>
                      Current Level
                    </label>
                    <div className="mt-2">
                      <select
                        name="currentlevel"
                        id="currentlevel"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={currentlevel}
                        onChange={handlecurrentlevelChange}
                      >
                      {Object.entries(level).map(([key, value]) => (
                          <option key={key} value={key}>
                              {key}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="relative block gap-x-3 col-span-full mt-2">
                    <label htmlFor="fuelused" className='block text-sm font-medium leading-6 text-gray-900'>
                      Goal Level
                    </label>
                    <div className="mt-2">
                      <select
                        name="goallevel"
                        id="goallevel"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Goal trailblaze level"
                        value={goallevel}
                        onChange={handlegoallevelChange}
                      >
                      {Object.entries(level).map(([key, value]) => (
                          <option key={key} value={key}>
                              {key}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="relative block gap-x-3 col-span-full mt-2">
                    <label htmlFor="fuelused" className='block text-sm font-medium leading-6 text-gray-900'>
                      Current EXP
                    </label>
                    <div className="mt-2">
                    <input
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        type="number"
                        id="exp"
                        name="exp"
                        onChange={handleCurrentExpChange}
                        value={exp}
                    />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="bg-white border-t border-gray-200 shadow-2xl p-4 rounded-lg">
            <fieldset className='p-4'>
                <legend className='text-md text-center font-semibold leading-6 text-gray-900'>Activities</legend>
                <div className="space-y-6 border-t border-gray-200">
                  <div className="relative flex gap-x-3 col-span-full mt-4">
                    <div className='flex h-6 items-center'>
                      <input
                          type="checkbox"
                          id="dailyTraining"
                          name="dailyTraining"
                          onChange={handleDailyTrainingChange}
                          checked={isdailytrainingchecked}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="tprefill" className="font-medium text-gray-900">
                        Daily training
                      </label>
                      <p className="text-gray-500">Completed 5 daily trainings</p>
                    </div>
                  </div>
                  <div className="relative block gap-x-3 col-span-full mt-2">
                    <label htmlFor="fuelused" className='block text-sm font-medium leading-6 text-gray-900'>
                      Daily trailblaze power used
                    </label>
                    <div className="mt-2">
                    <input
                        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        type="number"
                        id="tp"
                        name="tp"
                        onChange={handleTp}
                        value={tp}
                    />
                    </div>
                  </div>
                  <div className="relative flex gap-x-3 col-span-full mt-2">
                    <div className='flex h-6 items-center'>
                      <input
                          type="checkbox"
                          id="weeklyImmersifier"
                          name="weeklyImmersifier"
                          checked={isweeklyimmersifierchecked}
                          onChange={handleWeeklyImmersifierChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="tprefill" className="font-medium text-gray-900">
                        Immersifier
                      </label>
                      <p className="text-gray-500">Weekly immersifier in simulated universe.</p>
                    </div>
                    {isweeklyimmersifierchecked ? (
                        <input className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' type="text" value="4" readOnly />
                      ) : (
                        <input className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' type="text" value="0" readOnly />
                    )}
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="bg-white border-t border-gray-200 shadow-2xl p-4 rounded-lg">
              <fieldset className='p-4'>
                <legend className="text-md text-center font-semibold leading-6 text-gray-900">Recharges</legend>
                <div className="space-y-6 border-t border-gray-200">
                  <div className="relative block gap-x-3 col-span-full mt-4">
                    <label htmlFor="fuelused" className='block text-sm font-medium leading-6 text-gray-900'>
                      Fuel Used
                    </label>
                    <div className="mt-2">
                      <input
                            type="number"
                            id="fuelused"
                            name="fuelused"
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                            onChange={handlefuelusedChange}
                            value={fuelused}
                        />
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="tprefill"
                        name="tprefill"
                        type="checkbox"
                        onChange={handletprefillChange}
                        checked={istprefillchecked}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="tprefill" className="font-medium text-gray-900">
                        Refill Trailblaze Power
                      </label>
                      <p className="text-gray-500">Refill trailblaze power with stellar jade, not including fuel(s) and daily trailblaze power used.</p>
                    </div>
                      {istprefillchecked && (
                      <div className="text-sm leading-6">
                        <label className="font-medium text-gray-900">
                          How much?
                        </label>
                        <select
                        name="tprefill"
                        className='w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
                        value={selectedtprefill}
                        onChange={handleselectedtprefillChange}
                        >
                        {Object.entries(tprefill).map(([key, value]) => (
                        <option key={key} value={value}>
                            {key}
                        </option>
                      ))}
                        </select>
                      </div>
                      )}
                  </div>
                </div>
              </fieldset>    
            </div>
          </div>
          </form>
          <div className="mt-12">
            <h2>Result.</h2>
            <p>
            Current trailblaze level: {currentlevel}<br/>
            Current EXP: {exp}<br/>
            Daily trailblaze power used: {tp}<br/>
            Fuel used: {fuelused}<br/>
            Doing daily training: {yesorno}<br/>
            Weekly Immersifier: {getWeeklyImmersifierValue()}<br/>
            Refill trailblaze power using stellar jade: {refillyesorno}<br/>
            Total refill trailblaze power using stellar jade: {usedtprefill}<br/>
            Stellar jade used: {selectedtprefill}<br/>
            EXP Needed: {calculateExpNeeded()}<br/>
            Est. day needed: {calculateDayNeeded()}
            </p>
          </div>
    </div>
      <footer className='border-t pt-8 flex justify-center mt-8 space-x-6 tails-selected-element text-base leading-6 text-center tails-selected-element'>
        Made with {' '}
        <a href='https://nextjs.org' className='mx-2'>
          <span className="sr-only">Nextjs</span>
          <svg aria-hidden="true" height="17" role="img" viewBox="0 0 394 79" width="85">
            <path d="M261.919 0.0330722H330.547V12.7H303.323V79.339H289.71V12.7H261.919V0.0330722Z" fill="var(--geist-foreground)"></path><path d="M149.052 0.0330722V12.7H94.0421V33.0772H138.281V45.7441H94.0421V66.6721H149.052V79.339H80.43V12.7H80.4243V0.0330722H149.052Z" fill="var(--geist-foreground)"></path><path d="M183.32 0.0661486H165.506L229.312 79.3721H247.178L215.271 39.7464L247.127 0.126654L229.312 0.154184L206.352 28.6697L183.32 0.0661486Z" fill="var(--geist-foreground)"></path><path d="M201.6 56.7148L192.679 45.6229L165.455 79.4326H183.32L201.6 56.7148Z" fill="var(--geist-foreground)"></path><path clip-rule="evenodd" d="M80.907 79.339L17.0151 0H0V79.3059H13.6121V16.9516L63.8067 79.339H80.907Z" fill="var(--geist-foreground)" fill-rule="evenodd"></path><path d="M333.607 78.8546C332.61 78.8546 331.762 78.5093 331.052 77.8186C330.342 77.1279 329.991 76.2917 330 75.3011C329.991 74.3377 330.342 73.5106 331.052 72.8199C331.762 72.1292 332.61 71.7838 333.607 71.7838C334.566 71.7838 335.405 72.1292 336.115 72.8199C336.835 73.5106 337.194 74.3377 337.204 75.3011C337.194 75.9554 337.028 76.5552 336.696 77.0914C336.355 77.6368 335.922 78.064 335.377 78.373C334.842 78.6911 334.252 78.8546 333.607 78.8546Z" fill="var(--geist-foreground)"></path><path d="M356.84 45.4453H362.872V68.6846C362.863 70.8204 362.401 72.6472 361.498 74.1832C360.585 75.7191 359.321 76.8914 357.698 77.7185C356.084 78.5364 354.193 78.9546 352.044 78.9546C350.079 78.9546 348.318 78.6001 346.75 77.9094C345.182 77.2187 343.937 76.1826 343.024 74.8193C342.101 73.456 341.649 71.7565 341.649 69.7207H347.691C347.7 70.6114 347.903 71.3838 348.29 72.0291C348.677 72.6744 349.212 73.1651 349.895 73.5105C350.586 73.8559 351.38 74.0286 352.274 74.0286C353.243 74.0286 354.073 73.8286 354.746 73.4196C355.419 73.0197 355.936 72.4199 356.296 71.6201C356.646 70.8295 356.831 69.8479 356.84 68.6846V45.4453Z" fill="var(--geist-foreground)"></path><path d="M387.691 54.5338C387.544 53.1251 386.898 52.0254 385.773 51.2438C384.638 50.4531 383.172 50.0623 381.373 50.0623C380.11 50.0623 379.022 50.2532 378.118 50.6258C377.214 51.0075 376.513 51.5164 376.033 52.1617C375.554 52.807 375.314 53.5432 375.295 54.3703C375.295 55.061 375.461 55.6608 375.784 56.1607C376.107 56.6696 376.54 57.0968 377.103 57.4422C377.656 57.7966 378.274 58.0874 378.948 58.3237C379.63 58.56 380.313 58.76 380.995 58.9236L384.14 59.6961C385.404 59.9869 386.631 60.3778 387.802 60.8776C388.973 61.3684 390.034 61.9955 390.965 62.7498C391.897 63.5042 392.635 64.413 393.179 65.4764C393.723 66.5397 394 67.7848 394 69.2208C394 71.1566 393.502 72.8562 392.496 74.3285C391.491 75.7917 390.043 76.9369 388.143 77.764C386.252 78.582 383.965 79 381.272 79C378.671 79 376.402 78.6002 374.493 77.8004C372.575 77.0097 371.08 75.8463 370.001 74.3194C368.922 72.7926 368.341 70.9294 368.258 68.7391H374.235C374.318 69.8842 374.687 70.8386 375.314 71.6111C375.95 72.3745 376.78 72.938 377.795 73.3197C378.819 73.6923 379.962 73.8832 381.226 73.8832C382.545 73.8832 383.707 73.6832 384.712 73.2924C385.708 72.9016 386.492 72.3564 387.055 71.6475C387.627 70.9476 387.913 70.1206 387.922 69.1754C387.913 68.312 387.654 67.5939 387.156 67.0304C386.649 66.467 385.948 65.9944 385.053 65.6127C384.15 65.231 383.098 64.8856 381.899 64.5857L378.081 63.6223C375.323 62.9225 373.137 61.8592 371.541 60.4323C369.937 59.0054 369.143 57.115 369.143 54.7429C369.143 52.798 369.678 51.0894 370.758 49.6261C371.827 48.1629 373.294 47.0268 375.148 46.2179C377.011 45.4 379.114 45 381.456 45C383.836 45 385.92 45.4 387.719 46.2179C389.517 47.0268 390.929 48.1538 391.952 49.5897C392.976 51.0257 393.511 52.6707 393.539 54.5338H387.691Z" fill="var(--geist-foreground)"></path>
          </svg>
        </a>
      </footer>
    </section>
    
  );
}
