import { Container, Image, Nav, Navbar, NavItem } from "react-bootstrap";
import styles from '@/styles/Navigation.module.scss'
import { signOut, signIn, useSession } from 'next-auth/react'

import Link from "next/link";

const Navigation = ({ }) => {
    const {data: session } = useSession();

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
                            {session ? (
                                <Nav.Item>
                                    <Link href='' onClick={signOut} className={styles.Navigation_link}>Sign Out</Link>
                                </Nav.Item>
                            ) : (
                                <Nav.Item>
                                    <Link href='' onClick={signIn} className={styles.Navigation_link}>Sign In</Link>
                                </Nav.Item>
                            )}
                            
                            
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Navigation;