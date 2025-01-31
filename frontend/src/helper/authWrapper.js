import Sidebar from "../components/Sidebar";

const authWrapper = (WrappedComponent) => {
    return (props) => {



        return (
            <>
            <Sidebar/>
            <WrappedComponent {...props} />
            </>
        );
    };
};

export default authWrapper