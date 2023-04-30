import { Container, Image, Nav, Navbar } from "react-bootstrap";
import styles from '../../styles/Navigation.module.scss';
import { signOut, signIn, useSession } from 'next-auth/react'
import Link from "next/link";
import FirestoreClient from "@/client/FirestoreClient";
import { useEffect, useRef } from "react";
import { Session } from "next-auth";
import { log } from "console";

type NavigationProps = {

}

export const Navigation = ({ }: NavigationProps): JSX.Element => {
    const { data: session } = useSession();
    const sessionSetRef = useRef(false);

    useEffect(() => {
        if (!sessionSetRef.current && session) {
            sessionSetRef.current = true;
            onSignIn(session);
        }
    }, [session]);

    const firestoreClient = new FirestoreClient();

    const onSignIn = async (session: Session) => {
        await firestoreClient.createUser(session.user);
    }

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
                                    <Link id='signOut' href='' onClick={() => signOut()} className={styles.Navigation_link}>Sign Out</Link>
                                </Nav.Item>
                            ) : (
                                <Nav.Item>
                                    <Link id='signIn' href='' onClick={() => signIn()} className={styles.Navigation_link}>Sign In</Link>
                                </Nav.Item>
                            )}


                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}