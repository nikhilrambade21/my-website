import React from "react";

const OurProcess = () => {
  return (
    <div className="bg-[#ecd3bf] min-h-screen">

      {/* Hero Section */}
      <div className="relative bg-cover bg-center py-16">
        <div className="absolute inset-0 bg-[#8d8d88]"></div>

        <div className="relative text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Traditional Process
          </h1>
          <p className="text-lg text-gray-200">
            Pure • Natural • Chemical Free
          </p>
        </div>
      </div>

      {/* Step Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Step 1 */}
        <div className="mb-16 grid md:grid-cols-2 gap-10 items-center ml-40">
          <div>
            <h2 className="text-3xl font-bold text-[#5c1d1d] mb-4">
              1. Premium Seed Selection
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg font-bold">
              We carefully select high quality seeds from trusted farmers.
              Seeds are cleaned and sorted before extraction to maintain
              purity and natural quality.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-16 grid md:grid-cols-2 gap-10 items-center ml-50">
          

          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-[#5c1d1d] mb-4">
              2. Lakdi Ghani Extraction
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg font-bold">
              Oil is extracted using traditional wooden ghani method. This
              slow pressing technique keeps nutrients, aroma and natural
              taste intact.
            </p>
          </div>
        </div>


        {/* Step 3 */}
        <div className="mb-16 grid md:grid-cols-2 gap-10 items-center ml-60">
          <div>
            <h2 className="text-3xl font-bold text-[#5c1d1d] mb-4 ">
              3. Natural Filtering
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg font-bold">
              Oil is naturally filtered using traditional settling and cloth
              filtration method without using any chemicals.
            </p>
          </div>
        </div>

       
 
        {/* Step 4 */}
        <div className="grid md:grid-cols-2 gap-10 items-center ml-70">

          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-[#5c1d1d] mb-4">
              4. Hygienic Packaging
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg font-bold">
              The oil is packed in food-grade bottles under hygienic
              conditions to preserve freshness and purity.
            </p>
          </div>
        </div>

      </div>

      
        {/* Video Section 1 */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-[#5c1d1d] mb-8">
            Introducing Cold Pressed Groundnut oil 
          </h2>

      <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl">
            <video
              controls
              className="w-full"
            >
              <source src="/videos/process1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

         {/* Video Section 2 */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-[#5c1d1d] mb-8">
              Introducing Cold Pressed Coconut oil 
          </h2>
        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl">
            <video
              controls
              className="w-full"
            >
              <source src="/videos/process2.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

      {/* Trust Section */}
      <div className="bg-[#8d8d88] text-white py-10 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Why Choose Dirghayush Oils?
        </h2>

        <p className="max-w-3xl mx-auto text-gray-200">
          100% Traditional Wooden Ghani Oil | No Chemicals | No Preservatives |
          Pure & Natural Extraction Process
        </p>
      </div>

    </div>
  );
};

export default OurProcess;
