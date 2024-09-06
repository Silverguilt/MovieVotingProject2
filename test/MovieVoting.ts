import { expect } from 'chai';
import hre from 'hardhat';
import { MovieVoting } from '../contracts/MovieVoting';

describe('MovieVoting', function () {
  async function deployMovieVotingFixture() {
    const MovieVotingFactory = await hre.ethers.getContractFactory(
      'MovieVoting'
    );
    const movieVoting = await MovieVotingFactory.deploy();
    return { movieVoting };
  }

  describe('Deployment', function () {
    it('Should deploy the MovieVoting contract', async function () {
      const { movieVoting } = await deployMovieVotingFixture();
      expect((movieVoting as MovieVoting).address).to.not.equal(0);
    });
  });

  describe('Voting Session', function () {
    it('Should allow the contract owner to create a voting session', async function () {
      const { movieVoting } = await deployMovieVotingFixture();
      const [owner] = await hre.ethers.getSigners();
      const movieNames = ['Movie 1', 'Movie 2'];
      const durationInMinutes = 10;

      await expect(
        movieVoting.createVotingSession(movieNames, durationInMinutes)
      )
        .to.emit(movieVoting, 'VotingSessionCreated')
        .withArgs(0, owner.address, movieNames);

      const session = await movieVoting.votingSessions(0);
      expect(session.creator).to.equal(owner.address);
      expect(session.isVotingOpen).to.be.true;
    });

    it('Should allow users to vote in an open session', async function () {
      const { movieVoting } = await deployMovieVotingFixture();
      const [owner, voter] = await hre.ethers.getSigners();
      const movieNames = ['Movie 1', 'Movie 2'];
      const durationInMinutes = 10;

      await movieVoting.createVotingSession(movieNames, durationInMinutes);
      await expect(movieVoting.connect(voter).vote(0, 'Movie 1'))
        .to.emit(movieVoting, 'VoteCast')
        .withArgs(0, voter.address, 'Movie 1');

      const hasVoted = await movieVoting.hasVoted(0, voter.address);
      expect(hasVoted).to.be.true;
    });

    it('Should not allow voting for an invalid movie', async function () {
      const { movieVoting } = await deployMovieVotingFixture();
      const [owner, voter] = await hre.ethers.getSigners();
      const movieNames = ['Movie 1', 'Movie 2'];
      const durationInMinutes = 10;

      await movieVoting.createVotingSession(movieNames, durationInMinutes);
      await expect(
        movieVoting.connect(voter).vote(0, 'Invalid Movie')
      ).to.be.revertedWithCustomError(movieVoting, 'InvalidMovieName');
    });

    it('Should not allow voting twice in the same session', async function () {
      const { movieVoting } = await deployMovieVotingFixture();
      const [owner, voter] = await hre.ethers.getSigners();
      const movieNames = ['Movie 1', 'Movie 2'];
      const durationInMinutes = 10;

      await movieVoting.createVotingSession(movieNames, durationInMinutes);
      await movieVoting.connect(voter).vote(0, 'Movie 1');

      await expect(
        movieVoting.connect(voter).vote(0, 'Movie 2')
      ).to.be.revertedWithCustomError(movieVoting, 'AlreadyVoted');
    });

    it('Should end the voting session and declare a winner', async function () {
      const { movieVoting } = await deployMovieVotingFixture();
      const [owner, voter1, voter2] = await hre.ethers.getSigners();
      const movieNames = ['Movie 1', 'Movie 2'];
      const durationInMinutes = 10;

      await movieVoting.createVotingSession(movieNames, durationInMinutes);
      await movieVoting.connect(voter1).vote(0, 'Movie 1');
      await movieVoting.connect(voter2).vote(0, 'Movie 2');

      await expect(movieVoting.endVoting(0))
        .to.emit(movieVoting, 'VotingEnded')
        .withArgs(0, 'Movie 1'); // Adjust based on voting results

      const session = await movieVoting.votingSessions(0);
      expect(session.isVotingOpen).to.be.false;
    });

    it('Should not allow a non-creator to end the voting session', async function () {
      const { movieVoting } = await deployMovieVotingFixture();
      const [owner, other] = await hre.ethers.getSigners();
      const movieNames = ['Movie 1', 'Movie 2'];
      const durationInMinutes = 10;

      await movieVoting.createVotingSession(movieNames, durationInMinutes);
      await expect(
        movieVoting.connect(other).endVoting(0)
      ).to.be.revertedWithCustomError(movieVoting, 'OnlySessionCreator');
    });

    it('Should not allow voting after the voting session ends', async function () {
      const { movieVoting } = await deployMovieVotingFixture();
      const [owner, voter] = await hre.ethers.getSigners();
      const movieNames = ['Movie 1', 'Movie 2'];
      const durationInMinutes = 10;

      await movieVoting.createVotingSession(movieNames, durationInMinutes);
      await hre.network.provider.send('evm_increaseTime', [
        durationInMinutes * 60 + 1,
      ]);
      await hre.network.provider.send('evm_mine');

      await expect(
        movieVoting.connect(voter).vote(0, 'Movie 1')
      ).to.be.revertedWithCustomError(movieVoting, 'VotingAlreadyEnded');
    });

    it('Should not allow creating a voting session with no movies', async function () {
      const { movieVoting } = await deployMovieVotingFixture();
      const durationInMinutes = 10;

      await expect(
        movieVoting.createVotingSession([], durationInMinutes)
      ).to.be.revertedWithCustomError(movieVoting, 'InvalidMovieName');
    });
  });

  it('Should not allow ending a voting session that is already closed', async function () {
    const { movieVoting } = await deployMovieVotingFixture();
    const [owner] = await hre.ethers.getSigners();
    const movieNames = ['Movie 1', 'Movie 2'];
    const durationInMinutes = 10;

    await movieVoting.createVotingSession(movieNames, durationInMinutes);
    await movieVoting.endVoting(0);

    await expect(movieVoting.endVoting(0)).to.be.revertedWithCustomError(
      movieVoting,
      'VotingAlreadyClosed'
    );
  });
});
