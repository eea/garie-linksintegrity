const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process');
const { getLinksIntegrityFile, getData, getResults } = require('./');

const linksIntegrityTestData = fs.readFileSync('./test/mock-data/test.txt');

jest.mock('child_process', () => {
    return {
        spawn: jest.fn(() => ({
            on: jest.fn((process, callback) => {
                callback();
            }),
            stdout: { pipe: jest.fn() },
            stderr: { pipe: jest.fn() }
        }))
    }
});

describe('linskintegrity', () => {

    beforeEach(() => {
        const today = new Date();

        const filePath = path.join(__dirname, '../../reports/linksintegrity-results/www.test.com', today.toISOString());
        fs.ensureDirSync(filePath);

        fs.writeFileSync(path.join(filePath, 'linksintegrity.txt'), linksIntegrityTestData);
    })

    afterEach(() => {
        fs.removeSync(path.join(__dirname, '../../../reports/linksintegrity-results/www.test.com'));
    });

    describe('getLinksIntegrityFile', () => {

        it('finds and resolves the linkchecker results for the given url', async () => {

            const result = await getLinksIntegrityFile('www.test.com');

            expect(result).toEqual(getResults(linksIntegrityTestData));

        });

        it('rejects when no file can be found', async () => {
            fs.removeSync(path.join(__dirname, '../../reports/linksintegrity-results/linksintegrity.txt'));
            await expect(getLinksIntegrityFile('www.test.co.uk')).rejects.toEqual('Failed to get linksintegrity file for www.test.co.uk');
        });

    });

    describe('getData', () => {

        it('calls the shell script to get the data from linkchecker docker image and resolves with the test.txt file', async () => {

            const data = await getData('www.test.com');
            expect(child_process.spawn).toBeCalledWith('bash', [path.join(__dirname, './linkchecker.sh'), 'www.test.com', "/usr/src/garie-linksintegrity/reports/linksintegrity-results/www.test.com", "-r 1"]);

            expect(data).toEqual(getResults(linksIntegrityTestData));


        });

        it('rejects when child process fails', async () => {

            child_process.spawn.mockImplementation(() => {
                throw new Error('Failed');
            })

            await expect(getData('www.test.co.uk')).rejects.toEqual('Failed to get data for www.test.co.uk');

        });


    });

    describe('getResults', () => {
        it('test regex applied on the results', async () => {
            var str = "That's it. 1 link in 2 URLs checked. 0 warnings found. 0 errors found.";
            var results = getResults(str);
        });
    });

});