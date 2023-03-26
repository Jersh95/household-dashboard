import { Container, Image, Nav, Navbar } from "react-bootstrap";
import styles from '@/styles/Navigation.module.scss'

import Link from "next/link";

const Navigation = ({ }) => {
    return (
        <>
            <Navbar bg="dark" variant="dark" expand={false} className={styles.Navigation}>
                <Container fluid={true}>
                    <Link href='/' className={styles.link}>
                        <Navbar.Brand className='Navigation_brand'>
                            <Image
                                alt=""
                                src="/favicon.ico"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                            Split
                        </Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id='navbar-nav'>
                        <Nav className='ms-auto'>
                            <Nav.Item>
                                <Link href='/login' className={styles.Navigation_link}>Sign In</Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link href='/logout' className={styles.Navigation_link}>Sign Out</Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Navigation;