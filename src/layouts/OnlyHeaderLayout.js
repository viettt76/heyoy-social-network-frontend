import Header from '~/containers/Header';

const OnlyHeaderLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <div>{children}</div>
        </div>
    );
};

export default OnlyHeaderLayout;
