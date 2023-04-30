import { Navigation } from '@/components/Navigation/Navigation';
import { shallow, mount } from 'enzyme';
import { useSession, signIn, signOut } from 'next-auth/react'
import { Simulate, act } from 'react-dom/test-utils';

jest.mock('next-auth/react');
const mockUseSession = useSession as jest.Mock;
(signIn as jest.Mock).mockImplementation(() => jest.fn());
(signOut as jest.Mock).mockImplementation(() => jest.fn());
const mockCreateUser = jest.fn();
const mockGetUser = jest.fn();
jest.mock('../../../src/client/FirestoreClient', () => {
    return jest.fn().mockImplementation(() => {
        return {
            createUser: mockCreateUser,
            getUser: mockGetUser,
        }
    });
});

afterEach(() => {
    mockCreateUser.mockReset();
    mockGetUser.mockReset();
    mockUseSession.mockReset();
});

describe('Navigation', () => {
    it('renders with session', async () => {
        const mockSession = {
            data: {
                user: {
                    id: 'some-ID',
                    name: "Test User",
                    email: "test-user@test.com",
                    image: 'some-url'
                }
            },
        };
        
        mockUseSession.mockReturnValue(mockSession);
        mockCreateUser.mockImplementation(async () => {});
        
        const component = mount(<Navigation />);

        expect(mockCreateUser).toHaveBeenCalledWith(mockSession.data.user);
        expect(component.exists('#signOut')).toBe(true);
        expect(component.exists('#signIn')).toBe(false);

        const button = component.find('#signOut').first();
        act(() => {
            button.simulate('click');
        });
        expect(signOut).toHaveBeenCalled();
    });

    it('renders with session', async () => {        
        const mockSession = {
            data: undefined,
        };
        
        mockUseSession.mockReturnValue(mockSession);
        mockCreateUser.mockImplementation(async () => {});
        
        const component = mount(<Navigation />);

        expect(mockCreateUser).not.toHaveBeenCalled();
        expect(component.exists('#signOut')).toBe(false);
        expect(component.exists('#signIn')).toBe(true);

        const button = component.find('#signIn').first();
        act(() => {
            button.simulate('click');
        });
        expect(signIn).toHaveBeenCalled();
    });
    
});