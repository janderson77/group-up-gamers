import React,{Fragment} from 'react';
import LayoutDefault from "../../layouts/LayoutDefault";
import Breadcrumb from "../../components/breadcrumb/BreadcrumbOne";
import breadcrumbBg from "../../assets/img/bg/bg-image-8.jpg";
import Blogs from "../../container/blog/pages/BlogContainer";

const BlogWithoutSidebar = () => {
    return (
        <Fragment>
            <LayoutDefault className="template-color-1 template-font-1">
                <Breadcrumb
                    title="Blog"
                    bg={breadcrumbBg}
                />
                <Blogs
                    sidebar={false}
                />
            </LayoutDefault>
        </Fragment>
    );
};

export default BlogWithoutSidebar;
