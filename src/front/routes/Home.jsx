import { Link } from 'react-router-dom';

export default function Home() {
    return <div className="home">
      <h1>Výukový simulátor procesního řízení</h1>
      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis pulvinar. Maecenas sollicitudin. Vivamus luctus egestas leo. Ut tempus purus at lorem. Phasellus et lorem id felis nonummy placerat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Integer malesuada. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Nullam at arcu a est sollicitudin euismod. Maecenas aliquet accumsan leo. Integer vulputate sem a nibh rutrum consequat.</p>

      <p>Nulla est. Aenean placerat. Etiam dui sem, fermentum vitae, sagittis id, malesuada in, quam. Mauris tincidunt sem sed arcu. Integer tempor. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Integer in sapien. Ut tempus purus at lorem. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
      
      <Link to="lesson-1">Přejít k výuce &gt;&gt;</Link>
      </div>
    ;
  }