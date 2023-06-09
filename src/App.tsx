import React from 'react';
import './App.css';
import {DisputeFile, DisputeFileUpload} from "./components/dispute-file-upload/DisputeFileUpload";

function App() {
  return (
    <div className="App">

      <DisputeFileUpload onDisputeFilesChange={(files: DisputeFile[]) => console.log(files)}/>
    </div>
  );
}

export default App;
