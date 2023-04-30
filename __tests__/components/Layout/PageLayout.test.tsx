import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageLayout from '@/components/Layout/PageLayout';
import { SessionProvider } from 'next-auth/react';
import { shallow, mount } from 'enzyme';
import { Button } from 'react-bootstrap';
import { Navigation } from '@/components/Navigation/Navigation';

describe('PageLayout', () => {
    it('renders', () => {
        const component = shallow(<PageLayout title='Testing' />);
        expect(component).toMatchSnapshot();
    });

    it('renders with children', () => {
        const component = shallow(<PageLayout title='Testing'><Button /></PageLayout>);
        expect(component.exists(Navigation));
        expect(component.exists(Button));
    });

});