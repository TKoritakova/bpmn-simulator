
import './App.css'

function App() {

  const act1 = new Activity('Zahájení', 2.0, 1, 100, 100);
  const act2 = new Activity('Kontrola', 3.0, 2, 300, 100);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <ActivityView activity={act1} heat={0.0} />
      <ActivityView activity={act2} heat={0.6} />
    </div>
  );


}

export default App;
