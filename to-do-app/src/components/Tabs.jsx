import React from 'react'

const Tabs = (props) => {
  const tabs = ['All', 'Open', 'Completed'];
  const {todos, selectedTab, setSelectedTab} = props;
  return (
    <nav className='tab-container'>
      {
        tabs.map((tab, tabIdx) => {
            const numOfTasks = tab === 'All' ? todos.length : tab == 'Open' ? todos.filter(val => !val.complete).length: 
              todos.filter(val => val.complete).length;
            return(
                <button onClick={()=>{
                  setSelectedTab(tab);
                }}
                  key = {tabIdx} className={'tab-button' +(tab === selectedTab ? ' tab-selected': '')}>
                    <h4>{tab} <span>({numOfTasks})</span></h4>
                </button>
            ) 
        })
      }
      <hr/>
    </nav>
  );
}

export default Tabs;
