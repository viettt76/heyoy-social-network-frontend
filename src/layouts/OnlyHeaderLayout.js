import Header from '~/containers/Header';

const OnlyHeaderLayout = ({ children }) => {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
};

export default OnlyHeaderLayout;
