/**
 * File: Main.js
 * 
 * The Main component is a React functional component that displays the main content of the 
 * application.
 * 
 * It returns a JSX element containing the following:
 * - A welcome message.
 * - A section describing the services offered.
 * - A section about the company.
 * 
 * The rendered content is wrapped in a main element.
 * 
 * The function does not take any props and does not have any side effects or dependencies.
 * 
 * The function is exported as a default export from the module.
 */


import logo from '../Logo/TheModernCut.webp';

function Main() {
  return (
    <main className="main">
      <div className="services">
        <h1>Welcome!</h1>
        <p>Experience the best grooming services in town!</p>
      </div>
      <section className="services">
        <h2>Our Services</h2>
        <p>We offer a variety of services to cater to your grooming needs. From classic cuts to modern styles, our professional team is here to help you look your best.</p>
      </section>
      <section className="about">
        <h2>About Us</h2>
        <p>We believe in the power of good grooming. We're not just a destination - we're a community for those who value looking good and feeling good.</p>
      </section>
      {/* ... */}
    </main>
  );
}
export default Main;