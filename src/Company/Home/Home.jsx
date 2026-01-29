import "./Home.css";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import { MdWork } from "react-icons/md";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoMdChatboxes } from "react-icons/io";
import { CiSearch } from "react-icons/ci";

function Home() {
    return (
        <div className="home-ibrohim">
            <Header />
            <section>
                <div className="container1">
                    <div className="main-content-container">
                        <div className="text">
                            <p className="p1">
                                Find aspiring talents and great employers
                            </p>
                            <p className="p2">
                                Finding the best candidate is always hard. Tell us what you are looking for and choose one from among the best.
                            </p>
                        </div>
                        <div className="search-wrapper">
                            <div className="search-labels">
                                <label className="label1">Hire a talent</label>
                                <label className="label2">Find a job</label>
                            </div>
                            <div className="search-box">
                                <div className="input1">
                                    <MdWork className="icon" />
                                    <input type="text"
                                        placeholder="Who are you looking for?"
                                    />
                                </div>

                                <div className="input-separator"></div>

                                <div className="input2">
                                    <MdWork className="icon" />
                                    <input type="text"
                                        placeholder="What job are you looking for?"
                                    />
                                </div>

                                <button className="search-btn">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container2">
                    <div className="box box1">
                        <BsPersonPlusFill className="box-icon" />
                        <div className="p1">Professional <br /> recruiter</div>
                        <div className="p2">Finding the best candidate is always hard.</div>
                    </div>
                    <div className="box box2">
                        <MdWork className="box-icon" />
                        <div className="p1">Find the right job you want fast</div>
                        <div className="p2">Launch your career on Workify.</div>
                    </div>
                    <div className="box box3">
                        <IoMdChatboxes className="box-icon" />
                        <div className="p1">All professionals need some help</div>
                        <div className="p2">As a pro recruiter, you need various skills to hire <br /> a great talent.</div>
                    </div>
                    <div className="box box4">
                        <CiSearch className="box-icon" />
                        <div className="p1">Searching a job may be long and boring</div>
                        <div className="p2">Landing a good gig can be hard, when you have a strong competition.</div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
};

export default Home;