/** @type {import('@portless/global/config').PortlessConfig} */
module.exports = {
  projects: [
    {
      name: "react-cliptext",
      urls: [
        {
          id: "vitest-ui",
          privateUrl: "http://localhost:5173",
          publicUrl: "http://react-cliptext.localhost",
        },
      ],
    },
  ],
};
